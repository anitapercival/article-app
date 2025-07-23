import { useEffect, useState } from "react";
import { fetchChannels } from "../api/filters";
import type { Channel } from "../api/filters";

interface Props {
  filters: {
    channel?: string;
  };
  setFilters: (filters: { channel?: string }) => void;
}

export default function Filters({ filters, setFilters }: Props) {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    fetchChannels().then(setChannels).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-6 flex-wrap">
        <button
          onClick={() => setFilters({ ...filters, channel: undefined })}
          className={`relative text-lg font-semibold pb-2 text-black transition cursor-pointer ${
            !filters.channel
              ? "after:absolute after:inset-x-0 after:-bottom-1 after:h-1 after:bg-[#FACF16]"
              : ""
          }`}
        >
          All Channels
        </button>
        {channels.map((channel) => (
          <button
            key={channel.slug}
            onClick={() => setFilters({ ...filters, channel: channel.slug })}
            className={`relative text-lg font-semibold pb-2 text-black transition cursor-pointer ${
              filters.channel === channel.slug
                ? "after:absolute after:inset-x-0 after:-bottom-1 after:h-1 after:bg-[#FACF16]"
                : ""
            }`}
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
}
