/**
 * @template withErrorHandler You don't need to worry about handling errors if you use `withErrorHandler`.
 * It catches any kinds of error, and send it to client as a Custom JSON format
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    throw new Error('Unexpected error occured!');
  }
};

export default withErrorHandler(handler);
