import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMemo, useState } from 'react';
import { useGetUserById } from '@/lib/react-query/queries';
import { Models } from 'appwrite';
import ProfileCard from '@/components/shared/ProfileCard';

interface Profile {
  name: string;
  email: string;
  imageUrl?: string;
  posts: Models.Document[];
  liked: Models.Document[];
}


 function Profile() {
   const {id} = useParams();
  const [profile, setProfile] = useState<Profile >({name:'', email:'', imageUrl:undefined, posts:[], liked:[]});
  const {data: userData, isLoading} = useGetUserById(id);
  useEffect(() =>{
      if(userData){
        setProfile({
          name: userData.name || 'No Name',
          email: userData.email || 'No Email',
          imageUrl: userData.imageUrl,
          posts: userData.posts || [],
          liked: userData.liked || []
        })
    } 
  },[userData,id]);

  if(isLoading){
    return <div>Loading...</div>
  }
  if (!userData) {
  return <p className="p-10">Loading profile...</p>;
  }

  return (
    <div className='p-10'>
      <ProfileCard profile={profile}/>
    </div>
  )
}

export default Profile