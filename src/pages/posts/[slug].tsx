import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import Posts from ".";
import { getPrismicClient } from "../../services/prismicio";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main>
        <article>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div dangerouslySetInnerHTML={{ __html: post.content }}>

          </div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

  const session = await getSession({ req })
  const { slug } = params;

  console.log(session)
  
  if (!session.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID('ignews-publications', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return {
    props: {
      post,
    },
  };
}