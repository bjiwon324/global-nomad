import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICON } from '@/constants';
import styles from './Notifications.module.scss';
import classNames from 'classnames/bind';
import { getMyNotifications } from '@/apis/get/getMyNotifications';
import { queryKey } from '@/apis/queryKey';
import getTimeAgo from '../utills/getTimeAgo';
import { delelteNotifications } from '@/apis/delete/deleteNotification';
import { useCustomInfiniteQuery } from '@/hooks/useCustomInfiniteQuery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useRef } from 'react';

const cn = classNames.bind(styles);

const { ellipse, xMedium } = ICON;

export default function Notifications() {
  const queryClient = useQueryClient();
  const observerRef = useRef<HTMLDivElement>(null);
  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    data: notificationsData,
    isSuccess,
  } = useCustomInfiniteQuery({
    queryKey: queryKey.myNotifications,
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getMyNotifications({ pageParam }, 2),
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => delelteNotifications(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKey.myNotifications }),
  });

  const handelDeleteNotification = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };

  function highlightContent(content: string) {
    if (content.includes('승인')) {
      return content.replace(
        /승인/g,
        '<span style= "color: #0085ff " >$&</span>'
      );
    } else if (content.includes('거절')) {
      return content.replace(/거절/g, '<span style="color: #ff472e">$&</span>');
    } else {
      return content;
    }
  }

  const description = (context: string) => {
    return (
      <div
        className={cn('notification-item-context')}
        dangerouslySetInnerHTML={{ __html: highlightContent(context) }}
      ></div>
    );
  };
  useIntersectionObserver({
    observerRef,
    hasNextPage,
    isFetching,
    fetchNextPage,
  });
  return (
    <>
      <h2 className={cn('title')}>알림 {notificationsData?.totalCount}개</h2>
      <ul
        className={cn('notification-list', {
          none: notificationsData?.totalCount === 0,
        })}
      >
        {!isSuccess ||
          (notificationsData.totalCount === 0 && (
            <h3 className={cn('item-none')}>알림이 없습니다.</h3>
          ))}
        {notificationsData?.pages.map((notification: any) => (
          <li key={notification.id} className={cn('notification-item')}>
            <div className={cn('notification-item-top-line')}>
              <Image
                src={ellipse.default.src}
                alt={ellipse.default.alt}
                width={5}
                height={5}
                className={cn(
                  { rejection: notification.content.includes('거절') },
                  { approval: notification.content.includes('승인') }
                )}
              />
              <button onClick={() => handelDeleteNotification(notification.id)}>
                <Image
                  src={xMedium.default.src}
                  alt={xMedium.default.alt}
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <h2>{description(notification.content)}</h2>

            <p className={cn('notification-item-timeAgo')}>
              {getTimeAgo(notification.createdAt)}
            </p>
          </li>
        ))}
        <div ref={observerRef} className={cn('ref-box')}>
          &nbsp;
        </div>
      </ul>
    </>
  );
}
