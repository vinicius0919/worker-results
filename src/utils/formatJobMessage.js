function isValid(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim().toLowerCase() === "undef") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

function formatList(list) {
  return list.map(item => `• ${item}`).join("\n");
}

function formatJobMessage(job) {
  let message = "";

  if (isValid(job.title)) {
    message += `🧾 *Vaga:* ${job.title}\n\n`;
  }

  if (isValid(job.summary)) {
    message += `📌 *Descrição:*\n${job.summary}\n\n`;
  }

  if (isValid(job.seniority)) {
    message += `🎯 *Senioridade:* ${job.seniority}\n\n`;
  }

  if (isValid(job.salary)) {
    message += `💰 *Remuneração:* ${job.salary}\n\n`;
  }

  if (isValid(job.tools_and_skills)) {
    message += `🛠️ *Ferramentas & Habilidades:*\n`;
    message += `${formatList(job.tools_and_skills)}\n\n`;
  }

  if (isValid(job.requirements)) {
    message += `📋 *Requisitos:*\n`;
    message += `${formatList(job.requirements)}\n\n`;
  }

  if (isValid(job.emails)) {
    message += `📧 *Emails para contato:*\n`;
    message += `${formatList(job.emails)}\n\n`;
  }

  if (isValid(job.contacts)) {
    message += `📞 *Contatos:*\n`;
    message += `${formatList(job.contacts)}\n\n`;
  }

  if (isValid(job.job_link)) {
    message += `🔗 *Link da vaga:*\n${job.job_link}\n\n`;
  }


  return message.trim();
}

module.exports = { formatJobMessage };
