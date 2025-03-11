import { createContext, useContext, useState } from "react";
import {
  RequestError,
  Guild,
  GuildApplication,
  GuildCreateProps,
  GuildMember,
  GuildUpdateProps,
} from "../types";
import api from "../api";
import { useToasts } from "./toasts";

type ContextType = {
  guild: Guild | null;
  members: GuildMember[];
  applications: GuildApplication[];
  loading: boolean;
  error: RequestError | null;
  createOrUpdateGuild: (
    data: GuildCreateProps | GuildUpdateProps | null,
    localOnly?: boolean
  ) => Promise<Guild | null>;
  loadGuild: (
    id: number | string,
    options?: {
      forceLoading?: boolean;
      withIcon?: boolean;
      withApplications?: boolean;
    }
  ) => Promise<Guild | null>;
  reloadGuild: () => void;
  unloadGuild: () => void;
  forceLoading: () => void;
  vote: () => Promise<void>;
  apply: (platforms: string[], application: string) => Promise<void>;
  deleteGuild: () => Promise<void>;
  makeAdmin: (id: number) => Promise<void>;
  removeAdmin: (id: number) => Promise<void>;
  removeMember: (id: number) => Promise<void>;
  resolveApplication: (id: number, accepted: boolean) => Promise<void>;
};

export const GuildContext = createContext<ContextType>({
  guild: null,
  members: [],
  applications: [],
  loading: false,
  error: null,
  createOrUpdateGuild: async () => null,
  loadGuild: async () => null,
  reloadGuild: () => {},
  unloadGuild: () => {},
  forceLoading: () => {},
  vote: async () => {},
  apply: async (platforms: string[], application: string) => {},
  deleteGuild: async () => {},
  makeAdmin: async (id: number) => {},
  removeAdmin: async (id: number) => {},
  removeMember: async (id: number) => {},
  resolveApplication: async (id: number, accepted: boolean) => {},
});

export const GuildProvider = ({ children }: { children: React.ReactNode }) => {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [applications, setApplications] = useState<GuildApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RequestError | null>(null);

  const toasts = useToasts();

  const updateError = (err: RequestError | null) => {
    setError(err);
    if (err) {
      toasts.add({
        message: err.message,
        type: "error",
        sameId: "guild_error",
      });
    }
  };

  const vote = async () => {
    if (guild) {
      await api.guilds.vote(guild.id);
      setGuild({
        ...guild,
        votes: guild.votes + 1,
        canGuildVote: false,
        ableToVoteAt: new Date(Date.now() + 86400000),
      });
    }
  };

  const apply = async (platforms: string[], application: string) => {
    if (!guild) return;
    await api.applications.apply(guild.id, {
      platforms,
      description: application,
    });
  };

  const resolveApplication = async (id: number, accepted: boolean) => {
    if (!guild) return;
    if (accepted) {
      await api.applications.accept(guild.id, id);
    } else {
      await api.applications.dismiss(guild.id, id);
    }
    await loadGuild(guild.id, { withApplications: true, withIcon: true });
  };

  const createOrUpdateGuild = async (
    data: GuildCreateProps | GuildUpdateProps | null
  ) => {
    if (!data) {
      console.error("Tried to update/create guild on server with null data!");
      return null;
    } else if ("id" in data && data?.id) {
      const result = await api.guilds.update(data.id, {
        ...data,
        id: undefined,
      });
      console.log("Update result", result);
      return result;
    } else {
      const dataCreate = data as GuildCreateProps;
      const result = await api.guilds.add({
        name: dataCreate.name,
        icon: dataCreate.icon,
        description: dataCreate.description,
        requirements: dataCreate.requirements,
        discordLink: dataCreate.discordLink,
        tag: dataCreate.tag,
        language: dataCreate.language,
        platforms: dataCreate.platforms,
      });
      console.log("Create result", result);
      return result;
    }
  };

  const deleteGuild = async () => {
    if (!guild) return;
    await api.guilds.delete(guild.id);
    unloadGuild();
  };

  const makeAdmin = async (id: number) => {
    if (!guild) return;
    await api.members.changeRole(guild.id, id, "ADMIN");
    await reloadGuild();
  };

  const removeAdmin = async (id: number) => {
    if (!guild) return;
    await api.members.changeRole(guild.id, id, "MEMBER");
    await reloadGuild();
  };

  const removeMember = async (id: number) => {
    if (!guild) return;
    await api.members.delete(guild.id, id);
    await reloadGuild();
  };

  const loadGuild = async (
    id: number | string,
    options?: {
      forceLoading?: boolean;
      withIcon?: boolean;
      withApplications?: boolean;
    }
  ) => {
    if (!guild || guild.id !== id || options?.forceLoading) {
      setLoading(true);
    }

    updateError(null);

    const isSlug = typeof id === "string";

    const response = isSlug
      ? await api.guilds.getSlug(id, options?.withIcon)
      : await api.guilds.get(id, options?.withIcon);

    if (!response) {
      setLoading(false);
      setGuild(null);
      setApplications([]);
      updateError({ message: "There's no such guild 😔", code: 404 });
      return null;
    }

    setGuild({
      ...response,
      platforms:
        response.platforms?.map((p) => ({
          platform: p as unknown as string,
        })) || [],
    });

    const realId = isSlug ? response.id : id;

    const membersResponse = await api.members.getAll(realId);
    setMembers(membersResponse);

    if (options?.withApplications) {
      const applicationsResponse = await api.applications.getAll(realId);
      setApplications(applicationsResponse);
    } else {
      setApplications([]);
    }

    setLoading(false);
    return response;
  };

  const unloadGuild = () => {
    setGuild(null);
    setMembers([]);
    setApplications([]);
    setLoading(false);
    updateError(null);
  };

  const forceLoading = () => {
    setLoading(true);
  };

  const reloadGuild = async () => {
    updateError(null);
    if (guild) {
      const response = await api.guilds.get(guild.id);
      setGuild(response);
      const membersResponse = await api.members.getAll(guild.id);
      setMembers(membersResponse);
      setLoading(false);
    }
  };

  return (
    <GuildContext.Provider
      value={{
        guild,
        loading,
        error,
        createOrUpdateGuild,
        loadGuild,
        reloadGuild,
        members,
        applications,
        unloadGuild,
        forceLoading,
        vote,
        apply,
        makeAdmin,
        removeAdmin,
        removeMember,
        deleteGuild,
        resolveApplication,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
};

export const useGuild = () => {
  const context = useContext(GuildContext);
  if (context === undefined) {
    throw new Error("useGuild must be used within a GuildProvider");
  }
  return context;
};
