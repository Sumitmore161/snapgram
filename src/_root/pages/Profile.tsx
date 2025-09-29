import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { getUserPosts, getUsers } from "@/lib/appwrite/api";
import Loader from "@/components/shared/Loader";

type UserProfile = {
  $id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  imageUrl: string;
};

const Profile = () => {
  const { id } = useParams(); // 👈 get userId from URL
  const { user: loggedInUser, isLoading } = useUserContext();

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // fetch profile user (if not logged in user)
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        // no param → show logged in user
        setProfileUser(loggedInUser);
        return;
      }
      if (id === loggedInUser?.id) {
        setProfileUser(loggedInUser);
        return;
      }

      // fetch other user by ID
      try {
        const users = await getUsers(); // get all users
        const foundUser = users?.documents.find((u: any) => u.$id === id);
        setProfileUser(foundUser || null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [id, loggedInUser]);

  // fetch posts for that profile user
  useEffect(() => {
    const fetchPosts = async () => {
      if (!profileUser?.$id) return;
      setLoadingPosts(true);
      const res = await getUserPosts(profileUser.$id);
      if (res?.documents) {
        setPosts(res.documents);
      }
      setLoadingPosts(false);
    };
    fetchPosts();
  }, [profileUser]);

  if (isLoading || !profileUser) {
    return (
      <div className="flex-center h-screen">
        <Loader /> Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-6">
        <img
          src={profileUser.imageUrl}
          alt={profileUser.name}
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold">{profileUser.name}</h1>
          <p className="text-gray-500">@{profileUser.username}</p>
          <p className="text-gray-700 mt-2">{profileUser.bio || "No bio yet."}</p>
          <p className="text-sm text-gray-400">{profileUser.email}</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {loadingPosts ? (
          <div className="flex-center">
            <Loader /> Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="font-medium">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
