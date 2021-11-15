import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiBuilder } from '@src/backend/api-wrapper';

/**
 *
 * @api {get} /version [Get] /version
 * @apiName GetApiVersion
 * @apiGroup General
 * @apiVersion  0.1.0
 *
 *
 * @apiSuccess (200) {String} apiVersion api server version
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "apiVersion": "0.1.0"
 * }
 */
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.json({
      apiVersion: '0.1.0',
    });
  }
};

export default new NextApiBuilder(handler).build();
