import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import { Check, Clipboard, Eye, EyeOff, Quote, Type, X } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes.code || []), ['className', /^language-[\w-]+$/]],
    span: [...(defaultSchema.attributes.span || []), ['className', /^(tavora-spoiler|tavora-small-text)$/]],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
  },
};

const formatOptions = [
  { label: 'Grand titre', syntax: '# ', example: '# Bonjour', action: 'line-large' },
  { label: 'Titre moyen', syntax: '## ', example: '## Bonjour', action: 'line-medium' },
  { label: 'Petit titre', syntax: '### ', example: '### Bonjour', action: 'line-small' },
  { label: 'Petit texte', syntax: '-# ', example: '-# Note discrète', action: 'line-tiny' },
  { label: 'Gras', syntax: '**texte**', example: '**Bonjour**', action: 'bold' },
  { label: 'Italique', syntax: '*texte*', example: '*Bonjour*', action: 'italic' },
  { label: 'Souligné', syntax: '__texte__', example: '__Bonjour__', action: 'underline' },
  { label: 'Barré', syntax: '~~texte~~', example: '~~Bonjour~~', action: 'strike' },
  { label: 'Code', syntax: '`texte`', example: '`const x = 1`', action: 'code' },
  { label: 'Bloc de code', syntax: '```js\ncode\n```', example: '```js\nBonjour\n```', action: 'code-block' },
  { label: 'Citation', syntax: '> texte', example: '> À retenir', action: 'quote' },
  { label: 'Spoiler', syntax: '||texte||', example: '||Secret||', action: 'spoiler' },
  { label: 'Lien', syntax: '[texte](https://...)', example: '[Tavora](https://tavora.app)', action: 'link' },
  { label: 'Liste', syntax: '- élément', example: '- Premier élément', action: 'list' },
  { label: 'Liste numérotée', syntax: '1. élément', example: '1. Premier élément', action: 'ordered-list' },
  { label: 'Liste de tâches', syntax: '- [ ] tâche', example: '- [x] Terminé', action: 'task-list' },
  { label: 'Séparateur', syntax: '---', example: '---', action: 'rule' },
];

const languageAliases = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', shell: 'bash', yml: 'yaml', html: 'xml', xhtml: 'xml', cs: 'csharp', cpp: 'cpp', rs: 'rust', md: 'markdown' };
const languageLabels = { javascript: 'JavaScript', typescript: 'TypeScript', jsx: 'JSX / React', tsx: 'TSX / React', python: 'Python', xml: 'HTML / XML', css: 'CSS', scss: 'SCSS', json: 'JSON', sql: 'SQL', php: 'PHP', java: 'Java', c: 'C', cpp: 'C++', csharp: 'C#', go: 'Go', rust: 'Rust', kotlin: 'Kotlin', swift: 'Swift', ruby: 'Ruby', lua: 'Lua', bash: 'Bash', powershell: 'PowerShell', yaml: 'YAML', markdown: 'Markdown' };
const languageOptions = Object.entries(languageLabels);

const preprocess = (value) => String(value || '')
  .replace(/(^|\n)-# (.+)/g, '$1<span class="tavora-small-text">$2</span>')
  .replace(/__([^_\n]+)__/g, '<u>$1</u>')
  .replace(/\|\|([^\n|]+)\|\|/g, '<span class="tavora-spoiler">$1</span>');

const detectLanguage = (code) => {
  const source = String(code || '');
  if (/\brequire\s*\(|\bmodule\.exports\b|\bmongoose\.|\b(console\.(log|error)|process\.env)\b/.test(source)) return 'javascript';
  if (/\bfrom\s+['"]react['"]|\buse(State|Effect|Ref|Memo|Callback)\b|<[A-Z][\w.]*(?:\s[^>]*)?>/.test(source)) return /\.tsx?\b|interface\s+\w+|:\s*(string|number|boolean)\b/.test(source) ? 'tsx' : 'jsx';
  if (/\b(import|export)\b[\s\S]*\bfrom\s+['"][^'"]+['"]|\b(const|let|var)\s+\w+\s*=/.test(source)) return 'javascript';
  if (/(^|\n)\s*(def|from\s+\w+\s+import|class\s+\w+\s*\(|print\s*\()/m.test(source)) return 'python';
  if (/\b(SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|CREATE\s+TABLE|DELETE\s+FROM)\b/i.test(source)) return 'sql';
  if (/<\/?[a-z][^>]*>/i.test(source)) return 'xml';
  if (/(^|\n)\s*[.#]?[\w-]+\s*\{[\s\S]*:\s*[^}]+;/.test(source)) return 'css';
  if (/^\s*[[{].*[}\]]\s*$/s.test(source) && /["'][\w-]+["']\s*:/.test(source)) return 'json';
  const looksLikeCode = /[{};]|=>|\b(const|let|function|class|import|export|def|SELECT|FROM|<\/?[a-z][^>]*>|console\.log|print\s*\()/i.test(source);
  if (!looksLikeCode) return null;
  const result = hljs.highlightAuto(source);
  return result.relevance >= 1 || /(^|\n)\s*(const|let|var|function|class|def|SELECT|import|export)\b/i.test(source) ? result.language : null;
};

const isLikelyCode = (content) => {
  const lines = String(content || '').split('\n').filter((line) => line.trim());
  if (lines.length < 1) return false;
  const codeSignals = lines.reduce((score, line) => score + [
    /(^|\s)(const|let|var|function|class|def|return|import|export)\b/.test(line),
    /[{};]=?|=>/.test(line),
    /\b(SELECT|FROM|WHERE|INSERT|UPDATE)\b/i.test(line),
    /<\/?[a-z][^>]*>/i.test(line),
    /\w+\s*\([^)]*\)\s*[{:]?/.test(line),
  ].filter(Boolean).length, 0);
  return codeSignals >= 2 || (lines.length === 1 && codeSignals >= 1 && detectLanguage(content));
};

const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');
  if (inline) return <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-cyan-100" {...props}>{children}</code>;
  const explicitLanguage = className?.match(/language-([\w-]+)/)?.[1];
  const language = languageAliases[explicitLanguage] || explicitLanguage || detectLanguage(code);
  const languageLabel = languageLabels[language] || (language ? language.toUpperCase() : 'Code');
  let highlightedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (language && hljs.getLanguage(language)) {
    highlightedCode = hljs.highlight(code, { language, ignoreIllegals: true }).value;
  }
  const lines = highlightedCode.split('\n');
  const showLineNumbers = lines.length >= 4;
  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  return <div className="tavora-code-block"><div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[10px] text-white/35"><span>{languageLabel}</span><button type="button" onClick={copy} className="inline-flex items-center gap-1 text-white/50 hover:text-white">{copied ? <Check size={12} /> : <Clipboard size={12} />}{copied ? 'Copié' : 'Copier'}</button></div><pre className={showLineNumbers ? 'tavora-code-with-lines' : ''}>{showLineNumbers ? lines.map((line, index) => <span className="tavora-code-line" key={`${index}-${line}`}><span className="tavora-line-number">{index + 1}</span><code dangerouslySetInnerHTML={{ __html: line || ' ' }} /></span>) : <code className={language ? `language-${language}` : ''} dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />}</pre></div>;
};

export const MessageMarkdown = ({ content }) => (
  <div className="tavora-markdown mt-3 text-white/70">
    {isLikelyCode(content) && !String(content).includes('```') ? <CodeBlock>{content}</CodeBlock> : <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]} components={{
      code: CodeBlock,
      a: ({ href, children, ...props }) => <a {...props} href={/^https?:|^mailto:/i.test(href || '') ? href : '#'} target="_blank" rel="noreferrer noopener" className="text-cyan-200 underline decoration-cyan-200/40 underline-offset-2 hover:text-cyan-100">{children}</a>,
      input: ({ ...props }) => <input {...props} disabled className="mr-2 accent-cyan-300" />,
      blockquote: ({ children }) => <blockquote className="border-l-2 border-cyan-300/40 pl-3 text-white/55">{children}</blockquote>,
      h1: ({ children }) => <h1 className="text-3xl font-semibold text-white">{children}</h1>,
      h2: ({ children }) => <h2 className="text-2xl font-semibold text-white">{children}</h2>,
      h3: ({ children }) => <h3 className="text-xl font-semibold text-white">{children}</h3>,
      ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
      hr: () => <hr className="my-4 border-white/15" />,
      span: ({ className, children }) => className === 'tavora-spoiler' ? <Spoiler>{children}</Spoiler> : <span className="tavora-small-text">{children}</span>,
    }}>{preprocess(content)}</ReactMarkdown>}
  </div>
);

const Spoiler = ({ children }) => {
  const [revealed, setRevealed] = useState(false);
  return <button type="button" onClick={() => setRevealed((value) => !value)} className={`rounded px-1 transition ${revealed ? 'bg-white/10 text-white/80' : 'bg-white/10 text-transparent [text-shadow:0_0_8px_rgba(255,255,255,0.8)]'}`} aria-label={revealed ? 'Masquer le spoiler' : 'Révéler le spoiler'}>{children}</button>;
};

const wrapSelection = (value, start, end, before, after = before, fallback = 'texte') => {
  const selected = value.slice(start, end) || fallback;
  return { value: `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`, start: start + before.length, end: start + before.length + selected.length };
};

const applyFormat = (value, start, end, action) => {
  const lineActions = { 'line-large': '# ', 'line-medium': '## ', 'line-small': '### ', 'line-tiny': '-# ', quote: '> ', list: '- ', 'ordered-list': '1. ', 'task-list': '- [ ] ', rule: '---\n' };
  if (lineActions[action]) {
    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const prefix = lineActions[action];
    return { value: `${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`, start: start + prefix.length, end: end + prefix.length };
  }
  const pairs = { bold: ['**', '**'], italic: ['*', '*'], underline: ['__', '__'], strike: ['~~', '~~'], code: ['`', '`'], spoiler: ['||', '||'], 'code-block': ['```js\n', '\n```'] };
  if (pairs[action]) return wrapSelection(value, start, end, ...pairs[action]);
  if (action === 'link') {
    const link = window.prompt('URL du lien', 'https://');
    return link ? wrapSelection(value, start, end, '[', `](${link})`) : { value, start, end };
  }
  return { value, start, end };
};

export const MessageComposer = ({ value, onChange, onSubmit, placeholder, isSending, className = '', onKeyDown, children }) => {
  const textareaRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const fencedCode = value.match(/```([^\n]*)\n?([\s\S]*?)(?:```|$)/);
  const detectedCodeLanguage = fencedCode ? (languageAliases[fencedCode[1].trim().toLowerCase()] || fencedCode[1].trim().toLowerCase() || detectLanguage(fencedCode[2])) : '';
  const update = (nextValue, start, end) => { onChange(nextValue); requestAnimationFrame(() => { textareaRef.current?.focus(); textareaRef.current?.setSelectionRange(start, end); }); };
  const format = (action) => { const textarea = textareaRef.current; const result = applyFormat(value, textarea?.selectionStart || 0, textarea?.selectionEnd || 0, action); update(result.value, result.start, result.end); setMenuOpen(false); };
  const changeCodeLanguage = (event) => {
    if (!fencedCode) return;
    const language = event.target.value;
      const replacement = `${'```'}${language}\n`;
    onChange(`${value.slice(0, fencedCode.index)}${replacement}${value.slice(fencedCode.index + fencedCode[0].indexOf('\n') + 1)}`);
  };
  const submit = (event) => { event.preventDefault(); if (value.trim() === '/formatage') { setHelpOpen(true); onChange(''); return; } onSubmit(event); };
  return <form onSubmit={submit} className={`tavora-composer relative rounded-xl border p-3 ${className}`}>
    {children}
    {helpOpen ? <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-30 max-h-[min(70vh,32rem)] overflow-y-auto rounded-xl border border-white/10 bg-[#111118] p-3 shadow-2xl"><div className="mb-3 flex items-center justify-between"><h4 className="font-semibold text-white">Formatage Markdown</h4><button type="button" onClick={() => setHelpOpen(false)} className="text-white/50 hover:text-white"><X size={16} /></button></div><div className="grid gap-2 sm:grid-cols-2">{formatOptions.map((option) => <button type="button" key={option.action} onClick={() => { setHelpOpen(false); format(option.action); }} className="rounded-lg border border-white/10 p-2 text-left hover:bg-white/5"><span className="block text-xs font-medium text-white">{option.label}</span><code className="block text-[11px] text-cyan-200/80">{option.syntax}</code><span className="text-[11px] text-white/40">{option.example}</span></button>)}</div></div> : null}
    {menuOpen ? <div className="absolute bottom-[calc(100%+8px)] left-0 z-20 grid w-72 grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#111118] p-2 shadow-2xl">{formatOptions.map((option) => <button type="button" key={option.action} onClick={() => format(option.action)} className="rounded-lg px-2 py-1.5 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"><span className="block">{option.label}</span><code className="text-[10px] text-cyan-200/60">{option.syntax}</code></button>)}</div> : null}
    {preview ? <div className="min-h-[4.5rem] rounded-xl border border-white/5 bg-[#1a1a24] px-3 py-2"><MessageMarkdown content={value || '*Aperçu vide*'} /></div> : <textarea ref={textareaRef} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={onKeyDown || ((event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); if (!isSending && value.trim()) event.currentTarget.form?.requestSubmit(); } })} placeholder={placeholder} rows={3} className="w-full resize-none rounded-xl border border-white/5 bg-[#1a1a24] px-3 py-2 text-sm text-white outline-none" />}
    <div className="mt-2 flex flex-wrap items-center gap-1"><button type="button" title="Formatage" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"><Type size={16} /></button><button type="button" title={preview ? 'Écriture' : 'Aperçu'} onClick={() => setPreview((open) => !open)} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white">{preview ? <EyeOff size={16} /> : <Eye size={16} />}</button><button type="button" title="Aide formatage (/formatage)" onClick={() => setHelpOpen(true)} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"><Quote size={16} /></button>{fencedCode ? <label className="ml-2 inline-flex items-center gap-2 text-[11px] text-white/40">Langage<select value={detectedCodeLanguage || ''} onChange={changeCodeLanguage} className="rounded border border-white/10 bg-[#111118] px-1.5 py-1 text-[11px] text-cyan-200"><option value="">Auto</option>{languageOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label> : null}<span className="ml-auto text-[11px] text-white/25">{fencedCode && detectedCodeLanguage ? `Détecté : ${languageLabels[detectedCodeLanguage] || detectedCodeLanguage}` : 'Markdown actif'}</span></div>
  </form>;
};