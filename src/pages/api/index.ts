import { withErrorHandler } from '@src/utils/with-error-handler';

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 *
 * @api {get} / [GET] /
 * @apiName GetStatus
 * @apiGroup General
 * @apiVersion  0.1.0
 *
 * @apiSuccess (200) {String} status status of api server
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "ok"
 * }
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.json({ status: 'ok' });
  }
};

export default withErrorHandler(handler);
