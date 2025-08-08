export function sanitizeHtml(input: string): string {
  if (!input) return '';

  const allowedTags = new Set(['A', 'SPAN', 'B', 'I', 'STRONG', 'EM']);
  const allowedAttrs: Record<string, Set<string>> = {
    A: new Set(['href', 'target', 'rel', 'class']),
    SPAN: new Set(['class']),
    B: new Set([]),
    I: new Set([]),
    STRONG: new Set([]),
    EM: new Set([]),
  };

  const doc = new DOMParser().parseFromString(`<div>${input}</div>`, 'text/html');
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return '';

  const walk = (node: Element) => {
    // Fjern disallowed tags
    if (!allowedTags.has(node.tagName)) {
      const parent = node.parentElement;
      if (parent) {
        // Erstat node med dens tekstindhold
        parent.replaceChild(doc.createTextNode(node.textContent || ''), node);
      }
      return;
    }

    // Fjern uønskede attributes
    const attrs = Array.from(node.attributes);
    for (const attr of attrs) {
      const allowed = allowedAttrs[node.tagName];
      const isAllowed = allowed && allowed.has(attr.name);
      const isEventHandler = attr.name.toLowerCase().startsWith('on');
      if (!isAllowed || isEventHandler) {
        node.removeAttribute(attr.name);
        continue;
      }
      // Sikker href
      if (node.tagName === 'A' && attr.name === 'href') {
        const val = attr.value.trim();
        if (/^javascript:/i.test(val)) {
          node.setAttribute('href', '#');
        }
      }
      if (node.tagName === 'A' && attr.name === 'target') {
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }

    // Recurse
    Array.from(node.children).forEach(child => walk(child as Element));
  };

  Array.from(root.children).forEach(child => walk(child as Element));
  return root.innerHTML;
} 