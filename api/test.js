export default function handler(req, res) {
  res.status(200).json({ 
    status: "ok", 
    message: "Minimal JS Test works",
    env: process.env.NODE_ENV
  });
}
