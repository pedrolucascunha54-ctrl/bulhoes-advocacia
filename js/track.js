/* ============================================================
   BULHÕES SOCIEDADE DE ADVOCACIA — Google Ads / conversão de contato
   ============================================================

   Dispara em qualquer link de WhatsApp (wa.me / api.whatsapp.com) e em
   qualquer link de telefone (tel:). Usa delegação de evento, então vale
   para os botões atuais e para qualquer botão novo, sem precisar editar
   link por link.

   Para registrar a conversão no Google Ads, preencha CONVERSION_SEND_TO
   com o valor que o painel fornece, no formato:
       AW-18374462075/AbC-D_efGhIjK
   Enquanto estiver vazio, o clique é enviado apenas como evento comum.
   ============================================================ */

(function () {
  var CONVERSION_SEND_TO = ''; // ex.: 'AW-18374462075/AbC-D_efGhIjK'

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
      window.gtag('event', 'conversion', {
        send_to: CONVERSION_SEND_TO,
        event_callback: function () {},
      });
    }

    window.gtag('event', 'contato_clique', {
      canal: canal,
      origem: link.className || link.id || 'link',
    });
  }, true);
})();
