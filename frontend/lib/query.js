import { useContext, useState, useEffect } from 'react';
import { pipe, subscribe } from 'wonka';
import { Context, createQuery } from 'urql';

export const useQuery = ({ query, variables }) => {
  const [result, setResult] = useState({
    fetching: false,
    error: undefined,
    data: undefined,
  });

  const client = useContext(Context);

  useEffect(() => {
    setState(prev => ({ ...prev, fetching: true }));

    const request = createQuery(query, variables);

    const [teardown] = pipe(
      client.executeQuery(request),
      subscribe(({ data, error }) => {
        setResult({ fetching: false, data, error });
      })
    );

    return teardown;
  }, [query, variables]);

  return result;
};