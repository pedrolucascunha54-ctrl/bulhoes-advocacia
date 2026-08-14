/* ============================================================
   BULHÕES SOCIEDADE DE ADVOCACIA — Google Ads / conversão de contato
   ============================================================

   Dispara em qualquer link de WhatsApp (wa.me / api.whatsapp.com) e em
   qualquer link de telefone (tel:). Usa delegação de evento, então vale
   para os botões atuais e para qualquer botão novo, sem precisar editar
   link por link.

   A conversão registrada é a "Clique no WhatsApp", do Google Ads.
   A tag base (gtag.js) fica no <head> das páginas — não duplicar aqui.
   ============================================================ */

(function () {
  var CONVERSION_SEND_TO = 'AW-18374462075/WYv9CJKS5uEcEPuU0LlE';

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var canal;
    if (/wa\.me|api\.whatsapp\.com/i.test(href)) canal = 'whatsapp';
    else if (/^tel:/i.test(href)) canal = 'telefone';
    else return;

    if (typeof window.gtag !== 'function') return;

    if (CONVERSION_SEND_TO) {
      window.gtag('event', 'conversion', { send_to: CONVERSION_SEND_TO });
    }

    window.gtag('event', 'contato_clique', {
      canal: canal,
      origem: link.className || link.id || 'link',
    });
  }, true);
})();
