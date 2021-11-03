import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

interface Post {
  title: string;
  body: string;
  date: Date;
}

interface DisplayPostInterface extends Post {
  dateTime: DateTime
}

interface usePostHookReturnInterface {
  posts: DisplayPostInterface[] | null;
  error: Error | null;
  status: string;
}

interface usePostsHookInterface {
  (): usePostHookReturnInterface
}

const fakePostRequest: () => Promise<Post[]> = async () => {
  return [
    {
      title: "Post 1",
      body: "Post description 1",
      date: DateTime.fromISO('2021-10-30').toJSDate()
    },
    {
      title: "Post 2",
      body: "Post description 2",
      date: DateTime.fromISO('2021-09-30').toJSDate()
    },
    {
      title: "Post 3",
      body: "Post description 3",
      date: DateTime.fromISO('2021-11-02').toJSDate()
    },
    {
      title: "Post 4",
      body: "Post description 4",
      date: DateTime.fromISO('2021-11-03').toJSDate()
    },
    {
      title: "Post 5",
      body: "Post description 5",
      date: DateTime.fromISO('2021-01-30').toJSDate()
    }
  ]
}



const usePosts: usePostsHookInterface = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<DisplayPostInterface[] | null>(null);

  useEffect(() => {
    (async function callFakePostRequest() {
      setStatus("pending");
      setError(null);
      setPosts(null);
      try {
        const response = await (await fakePostRequest())
          .map((post) => ({ ...post, dateTime: DateTime.fromJSDate(post.date) }))
          .sort((first, second) => (first.dateTime.toMillis() - second.dateTime.toMillis()))
          ;
        setPosts(response);
        setStatus("success");
      }
      catch (fetchError: unknown) {
        setError(fetchError as Error);
        setStatus("error");
      }
    })()
  }, [])

  return { status, error, posts }
}

function App() {
  const { posts } = usePosts()
  return (
    <div className="App">
      {
        posts?.map((post) => {
          console.log(post.dateTime.toISO())
          return (
            <Card>
              <CardHeader title={post.title} subheader={post.dateTime.toISO()}></CardHeader>
              <CardContent>
                <Typography variant="body2">
                  {post.body}
                </Typography>
              </CardContent>
            </Card>
          )
        })
      }
    </div >
  );
}

export default App;
