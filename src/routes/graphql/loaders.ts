/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaClient, Post } from "@prisma/client";
import DataLoader from "dataloader";

export const Loaders = (prisma: PrismaClient) => ({
  memberTypeLoader: new DataLoader(async (ids: readonly string[]) => {
    const members = await prisma.memberType.findMany({
      where: {
        id: {
          in: [...ids]
        }
      }
    });
    const membersMap = members.reduce((map, member) => {
      return { ...map, [member.id]: member }
    }, {});
    return ids.map((id) => membersMap[id] || null)
  }),

  postsLoader: new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...ids]
        }
      }
    });
    const postsMap = posts.reduce((map, post) => {
      const authorsPosts = (map[post.authorId] as Post[]) || [];
      authorsPosts.push(post)
      return { ...map, [post.authorId]: authorsPosts }
    }, {});
    return ids.map((id) => postsMap[id] || [])
  }),

  profilesLoader: new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: [...ids]
        }
      }
    });
    const profilesMap = profiles.reduce((map, profile) => {
      return { ...map, [profile.userId]: profile }
    }, {});
    return ids.map((id) => profilesMap[id] || null)
  }),

  userSubscribedToLoader: new DataLoader(async (ids: readonly string[]) => {
    const usersWithAuthors = await prisma.user.findMany({
      where: {
        id: {
          in: [...ids]
        }
      },
      include: {
        userSubscribedTo: {
          select: {
            author: true
          }
        }
      }
    });
    const authorsMap = usersWithAuthors.reduce((map, author) => {
      const subscribedAuthors = author.userSubscribedTo.map(({ author }) => author);
      return { ...map, [author.id]: subscribedAuthors }
    }, {});
    return ids.map((id) => authorsMap[id] || [])
  }),
  
  subscribedToUserLoader: new DataLoader(async (ids: readonly string[]) => {
    const usersWithSubs = await prisma.user.findMany({
      where: {
        id: {
          in: [...ids]
        }
      },
      include: {
        subscribedToUser: {
          select: {
            subscriber: true
          }
        }
      }
    });
    const subsMap = usersWithSubs.reduce((map, sub) => {
      const subscribers = sub.subscribedToUser.map(({ subscriber }) => subscriber);
      return { ...map, [sub.id]: subscribers }
    }, {});
    return ids.map((id) => subsMap[id] || [])
  }),

})

export type LoadersType = ReturnType<typeof Loaders>
