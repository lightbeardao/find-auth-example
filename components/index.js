export function Button({ children, onClick }) {
  return (
    <button
      className="p-2 px-4 bg-blue-100 rounded-md shadow hover:bg-blue-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonGroup({ children, name }) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-white border">
      <p className="text-gray-500 font-medium">{name}</p>
      <div className="flex gap-4">{children}</div>
    </div>
  );
}
