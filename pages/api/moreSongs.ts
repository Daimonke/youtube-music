// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {}

export default async function moreSongs(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { playlistId, pageToken } = req.query
    const data = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&pageToken=${pageToken}&key=${process.env.API_KEY}`)
        .then(res => res.json())
    res.status(200).json(data)
}
