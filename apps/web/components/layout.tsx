import Navbar from "./navbar";

export default function Layout({ children }: any) {
  return (
    <div className="w-full bg-neutral-900 bp4-dark ">
      <div className="mx-auto p-1 h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
