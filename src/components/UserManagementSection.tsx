import { User } from '@/data/mockData';
import UserDetailView from '@/components/UserDetailView';
import UserGroupView from '@/components/UserGroupView';
import UsersTable from '@/components/UsersTable';

interface UserManagementSectionProps {
  users: User[];
  search: string;
  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
  isEditGroupModalOpen: boolean;
  setIsEditGroupModalOpen: (open: boolean) => void;
  isDeleteGroupModalOpen: boolean;
  setIsDeleteGroupModalOpen: (open: boolean) => void;
  editGroupName: string;
  setEditGroupName: (name: string) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const UserManagementSection = ({
  users,
  search,
  selectedGroup,
  setSelectedGroup,
  isEditGroupModalOpen,
  setIsEditGroupModalOpen,
  isDeleteGroupModalOpen,
  setIsDeleteGroupModalOpen,
  editGroupName,
  setEditGroupName,
  selectedUser,
  setSelectedUser,
}: UserManagementSectionProps) => {
  if (selectedUser) {
    return (
      <UserDetailView
        selectedUser={selectedUser}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  if (selectedGroup) {
    return (
      <UserGroupView
        users={users}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        isEditGroupModalOpen={isEditGroupModalOpen}
        setIsEditGroupModalOpen={setIsEditGroupModalOpen}
        isDeleteGroupModalOpen={isDeleteGroupModalOpen}
        setIsDeleteGroupModalOpen={setIsDeleteGroupModalOpen}
        editGroupName={editGroupName}
        setEditGroupName={setEditGroupName}
      />
    );
  }

  return (
    <UsersTable
      users={users}
      search={search}
      onSelectUser={setSelectedUser}
    />
  );
};

export default UserManagementSection;
