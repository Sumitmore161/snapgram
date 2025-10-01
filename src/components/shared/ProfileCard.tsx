import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Heart, FileText } from "lucide-react";
import { Models } from "appwrite";

interface Profile {
  name: string;
  email: string;
  imageUrl?: string;
  posts: Models.Document[];
  liked: Models.Document[];
}

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg p-4">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.imageUrl} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mt-3 flex items-center gap-2">
          <User className="h-5 w-5" /> {profile.name}
        </h2>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Mail className="h-4 w-4" /> {profile.email}
        </p>
      </CardHeader>

      <CardContent className="flex justify-around mt-4">
        <div className="flex flex-col items-center">
          <FileText className="h-5 w-5 mb-1 text-blue-500" />
          <p className="font-semibold">{profile.posts?.length || 0}</p>
          <span className="text-sm text-muted-foreground">Posts</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="h-5 w-5 mb-1 text-red-500" />
          <p className="font-semibold">{profile.liked?.length || 0}</p>
          <span className="text-sm text-muted-foreground">Liked</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
