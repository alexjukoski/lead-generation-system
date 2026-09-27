const WEBHOOK_URL = "https://hook.us2.make.com/rjsfunfkods9f4m096esrry61b4ne0n9";

document.addEventListener("DOMContentLoaded", () => {
  const leadForm = document.getElementById("leadForm");
  const btnSubmit = document.getElementById("btnSubmit");

  if (!leadForm) {
    console.error("Erro: O elemento <form id='leadForm'> não foi encontrado no HTML.");
    return;
  }

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButtonContent = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "<span>Enviando dados...</span>";

    // 1. Limpeza rigorosa do número de WhatsApp antes de enviar
    let rawWhatsapp = document.getElementById("whatsapp").value.trim();
    let phoneClean = rawWhatsapp.replace(/\D/g, ""); // Remove tudo o que não for número
    
    // Se digitou sem DDI (ex: 42999999999), adiciona o 55 do Brasil
    if (phoneClean.length === 10 || phoneClean.length === 11) {
      phoneClean = "55" + phoneClean;
    }

    const formData = {
      nome: document.getElementById("nome").value.trim(),
      whatsapp: phoneClean, // Envia o número já limpo (ex: 5542999999999)
      email: document.getElementById("email").value.trim(),
      empresa: document.getElementById("empresa").value.trim(),
      necessidade: document.getElementById("necessidade").value.trim()
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const mensagemWhatsapp = `Olá! Meu nome é *${formData.nome}* (empresa: *${formData.empresa}*).\n\nAcabei de preencher o formulário no site sobre: _"${formData.necessidade}"_.\n\nGostaria de dar sequência ao atendimento!`;
      const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(mensagemWhatsapp)}`;

      leadForm.reset();
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      alert("Ocorreu um erro ao enviar os dados. Tente novamente.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalButtonContent;
    }
  });
});