import { StatusCodes } from 'http-status-codes';
import { createRequest, createResponse } from 'node-mocks-http';

import { NextApiBuilder } from '.';

import type { ApiWrapper } from '.';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const mockHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const hello = req.query.hello || 'world';
  res.status(StatusCodes.OK).json({ hello });
};

const mockWrapper: ApiWrapper = (handler: NextApiHandler) => {
  const wrapped = async (req: NextApiRequest, res: NextApiResponse) => {
    req.query.hello = 'changed!';

    await handler(req, res);
  };

  return wrapped;
};

describe('NextApiBuilder', () => {
  it('Api wrapper should works well', async () => {
    const apiBuilder = new NextApiBuilder(mockHandler);
    const wrappedApiBuilder = new NextApiBuilder(mockHandler).add(mockWrapper);

    expect(apiBuilder.wrappers.length).toBe(1);
    expect(wrappedApiBuilder.wrappers.length).toBe(2);

    const apiHandler = apiBuilder.build();
    const wrappedApiHandler = wrappedApiBuilder.build();

    const req1 = createRequest();
    const res1 = createResponse();
    const req2 = createRequest();
    const res2 = createResponse();

    await apiHandler(req1, res1);
    await wrappedApiHandler(req2, res2);

    const body1 = res1._getJSONData() as { hello: string };
    const body2 = res2._getJSONData() as { hello: string };

    expect(res1._getStatusCode()).toBe(StatusCodes.OK);
    expect(res2._getStatusCode()).toBe(StatusCodes.OK);
    expect(body1.hello).toEqual('world');
    expect(body2.hello).toEqual('changed!');
  });

  it('Should not add duplicated wrappers', async () => {
    const apiBuilder = new NextApiBuilder(mockHandler).add(mockWrapper).add(mockWrapper);

    expect(apiBuilder.add(mockWrapper)).toStrictEqual(apiBuilder);
  });
});
