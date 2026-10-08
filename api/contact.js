module.exports = async (req, res) => {
  const { handleContactRequest } = await import('../src/server/contact-handler.mjs');
  return handleContactRequest(req, res);
};
