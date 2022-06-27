// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {}

export default async function getPlaylist(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { playlistId } = req.query
  const data = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${process.env.API_KEY}`)
    .then(res => res.json())
  console.log(data)
  res.status(200).json(data)
}
