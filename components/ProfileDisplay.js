export default function ProfileDisplay({ profile }) {
  if (!profile) return null;
  return (
    <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden w-72">
      <div
        className="bg-cover"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/6NmnrAJPq7M/800x400')",
        }}
      >
        <div className="flex flex-col items-center justify-center bg-black bg-opacity-25 py-6">
          <div className="rounded-full bg-white bg-opacity-25 p-2">
            <img
              src={
                profile.avatar ||
                "https://source.unsplash.com/BGz8vO3pK8k/160x160"
              }
              alt="User Avatar"
              className="inline-block w-20 h-20 rounded-full"
            />
          </div>
          <div className="text-center mt-3">
            <h3 className="text-white text-lg font-semibold">
              {profile.name}
            </h3>
            <p className="text-white opacity-90 text-sm">@{profile.findName}</p>
          </div>
        </div>
      </div>

      <div className="p-5 lg:p-6 flex-grow w-full text-center grid grid-cols-2 divide-x divide-gray-200">
        <div>
          <p className="text-xl font-semibold">{profile.collections?.length}</p>
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
            Collections
          </p>
        </div>
        <div>
          <p className="text-xl font-semibold">{profile.followers?.length}</p>
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
            Followers
          </p>
        </div>
      </div>

      <div className="p-5 text-sm bg-gray-700 text-gray-200 font-mono">
        {profile.description}
      </div>
    </div>
  );
}
