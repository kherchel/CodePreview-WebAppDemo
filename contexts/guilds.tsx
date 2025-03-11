import { createContext, useContext, useState } from "react";
import { Guild } from "../types";
import api from "../api";

type ContextType = {
  guilds: { [id: number]: Guild };
  loading: boolean;
  loadGuilds: (page: number, clear?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  updateGuild: (id: number, data: Partial<Guild>) => void;
  vote: (id: number) => Promise<void>;
  filters: { platform: string | null; language: string | null };
  updateFilters: (filters: {
    platform: string | null;
    language: string | null;
  }) => void;
  hasMore: boolean;
};

export const GuildsContext = createContext<ContextType>({
  guilds: {},
  loading: false,
  loadGuilds: async () => {},
  loadNextPage: async () => {},
  updateGuild: (id: number, data: Partial<Guild>) => {},
  vote: async () => {},
  filters: { platform: null, language: null },
  updateFilters: (filters: {
    platform: string | null;
    language: string | null;
  }) => {},
  hasMore: true,
});

export const GuildsProvider = ({ children }: { children: React.ReactNode }) => {
  const [guilds, setGuilds] = useState<{ [id: number]: Guild }>({});
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    platform: string | null;
    language: string | null;
  }>({ platform: null, language: null });
  const [hasMore, setHasMore] = useState(true);

  const updateGuild = (id: number, data: Partial<Guild>) => {
    const newGuilds = { ...guilds };
    newGuilds[id] = { ...newGuilds[id], ...data };
    setGuilds(newGuilds);
  };

  const vote = async (id: number) => {
    const foundGuild = guilds[id];
    if (foundGuild) {
      updateGuild(id, {
        votes: foundGuild.votes + 1,
        canGuildVote: false,
        ableToVoteAt: new Date(Date.now() + 86400000),
      });
    }
    await api.guilds.vote(id);
  };

  const loadGuilds = async (
    page: number,
    clear?: boolean,
    overrideFilters?: { platform: string | null; language: string | null }
  ) => {
    setLoading(true);
    if (clear) {
      setHasMore(true);
    }
    const response = await api.guilds.getAll({
      page,
      perPage: 20,
      filters: {
        platform:
          (overrideFilters?.platform
            ? overrideFilters.platform
            : filters.platform) || undefined,
        language:
          (overrideFilters?.language
            ? overrideFilters.language
            : filters.language) || undefined,
      },
    });
    const newGuilds = clear ? {} : { ...guilds };
    response.data.forEach((guild) => {
      newGuilds[guild.id] = guild;
    });
    if (response.data.length === 0) {
      setHasMore(false);
    }
    setGuilds(newGuilds);
    setLoadedPages(clear ? [page] : [...loadedPages, page]);
    setLoading(false);
  };

  const loadNextPage = async () => {
    // TODO: Add if hasMore here when guild count is implemented
    const lastPage =
      loadedPages.length > 0 ? loadedPages[loadedPages.length - 1] : 0;
    await loadGuilds(lastPage + 1);
  };

  const updateFilters = (newFilters: {
    platform: string | null;
    language: string | null;
  }) => {
    setFilters(newFilters);
    loadGuilds(1, true, newFilters);
  };

  return (
    <GuildsContext.Provider
      value={{
        guilds,
        loading,
        loadGuilds,
        loadNextPage,
        updateGuild,
        vote,
        filters,
        updateFilters,
        hasMore,
      }}
    >
      {children}
    </GuildsContext.Provider>
  );
};

export const useGuilds = () => {
  const context = useContext(GuildsContext);
  if (context === undefined) {
    throw new Error("useGuilds must be used within a GuildsProvider");
  }
  return context;
};
