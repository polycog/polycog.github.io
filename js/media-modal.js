// Media modal: any <button data-media="image|video" data-src="..."> opens it.
// Optional: data-caption="..." shows a line of text under the media.
// Video src can be a file (.mp4/.webm) or an embeddable page (YouTube, Drive preview).
// Safe to include or inline anywhere: it waits for <body> to exist before running.
(function () {
  function init() {
    const modal = document.createElement('dialog');
    modal.className = 'media-modal';
    modal.innerHTML =
      '<div class="media-modal-inner">' +
        '<button class="media-modal-close" type="button" aria-label="Close">' +
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
            '<path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
        '<div class="media-modal-body"></div>' +
      '</div>';
    document.body.appendChild(modal);

    const body = modal.querySelector('.media-modal-body');

    function open(btn) {
      const { media, src, caption } = btn.dataset;
      let html;
      if (media === 'video') {
        html = /\.(mp4|webm|ogg)(\?|$)/i.test(src)
          ? '<div class="media-video"><video controls autoplay playsinline></video></div>'
          : '<div class="media-video"><iframe allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
      } else {
        html = '<img alt="" />';
      }
      body.innerHTML = html;
      body.querySelector('video, iframe, img').src = src;
      if (media !== 'video') body.querySelector('img').alt = caption || '';
      if (caption) {
        const cap = document.createElement('div');
        cap.className = 'media-modal-caption';
        cap.textContent = caption;
        body.appendChild(cap);
      }
      modal.setAttribute('aria-label', caption || (media === 'video' ? 'Video' : 'Image'));
      modal.showModal();
    }

    // Buttons may sit inside a card that is itself a link, so stop the link from firing.
    // <button data-href="..."> opens that URL in a new tab (a real <a> can't nest in the card link).
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-media], [data-href]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      if (btn.dataset.href) window.open(btn.dataset.href, '_blank', 'noopener');
      else open(btn);
    });

    modal.querySelector('.media-modal-close').addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
    // Clear the media on close so video stops playing
    modal.addEventListener('close', () => { body.innerHTML = ''; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
