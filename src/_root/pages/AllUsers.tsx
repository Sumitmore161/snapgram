import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";

const AllUsers = () => {

    // const userInfo
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsers();
  // const allInfo = JSON.stringify(users);
  console.log(users)
  // return <div className="flex-col items-center justify-center"></div>;
  return <>
    <div>
      AllUsers
    </div>
  </>

};

export default AllUsers;
