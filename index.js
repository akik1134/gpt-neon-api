export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).send('pong');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
