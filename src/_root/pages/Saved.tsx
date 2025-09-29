import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { getSavedPosts, getPostById } from "@/lib/appwrite/api";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

type Post = {
  $id: string;
  caption: string;
  imageUrl: string;
  location?: string;
  tags?: string[];
  creator: {
    $id: string;
    name: string;
    imageUrl: string;
  };
};

const Saved = () => {
  const { user, isLoading } = useUserContext();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user?.id) return;
      setLoadingSaved(true);

      const savedDocs = await getSavedPosts(user.id);
      console.log("this is userid : ",user.id);
      if (savedDocs?.documents?.length) {
        const posts: Post[] = [];

        // fetch each post by ID
        for (const doc of savedDocs.documents) {
          const post = await getPostById(doc.post.$id);
          if (post) posts.push(post as Post);
        }

        setSavedPosts(posts);
      }

      setLoadingSaved(false);
    };

    fetchSavedPosts();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-center h-screen">
        <Loader /> Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-center h-screen">
        <p className="text-red-500">Please sign in to view saved posts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Saved Posts</h2>

      {loadingSaved ? (
        <div className="flex-center">
          <Loader /> Loading saved posts...
        </div>
      ) : savedPosts.length === 0 ? (
        <p className="text-gray-500">You haven’t saved any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {savedPosts.map((post) => (
            <div
              key={post.$id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <Link to={`/posts/${post.$id}`}>
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="p-4">
                <p className="font-medium">{post.caption}</p>
                {post.location && (
                  <p className="text-sm text-gray-500">{post.location}</p>
                )}
                <Link
                  to={`/profile/${post.creator.$id}`}
                  className="flex items-center gap-2 mt-3"
                >
                  <img
                    src={post.creator.imageUrl}
                    alt={post.creator.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">
                    {post.creator.name}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
