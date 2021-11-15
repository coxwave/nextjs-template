import { NextApiBuilder } from '@src/backend/api-wrapper';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    throw new Error('Unexpected error occured!');
  }
};

export default new NextApiBuilder(handler).build();
