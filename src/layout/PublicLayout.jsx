import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <main className="container py-4">
      <Outlet />
    </main>
  );
};

export default PublicLayout;
