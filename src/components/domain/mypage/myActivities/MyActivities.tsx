import { instance } from "@/apis/axios";
import { useCustomInfiniteQuery } from "@/hooks/useInfiniteQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "../MyCommonCard.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import MyActivitiesCard from "@/components/common/card/MyActivitiesCard";
import { GetActivitiesList } from "@/types/activities";
import DeleteQuestion from "@/components/common/popup/deleteQuestion/DeleteQuestion";
import Title from "@/components/common/title/Title";
import { useRouter } from "next/router";
const cn = classNames.bind(styles);
export default function MyActivities() {
  const [deleteActivityId, setDeleteActivityId] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const router = useRouter();
  const dialogRef = useRef(null);

  //본인이 등록한 체험정보 get API
  async function getMyActivities({ pageParam }: any) {
    const cursorId = pageParam ? `cursorId=${pageParam}&` : "";
    try {
      const response = await instance.get(`/my-activities?${cursorId}size=6`);
      return response.data;
    } catch (error: any) {
      console.error("활동을 불러오는 중 오류 발생:", error.message);
      return null;
    }
  }
  //inFiniteScroll을 위한 쿼리요청 키와 함수를 써줘야함
  const { fetchNextPage, hasNextPage, isFetching, data } =
    useCustomInfiniteQuery({
      queryKey: ["MyActivities"],
      queryFn: ({ pageParam }: any) => getMyActivities({ pageParam }),
    });

  //체험 카드 삭제 요청 API
  async function deleteActivity(activityId: number) {
    await instance.delete(`/my-activities/${activityId}`);
  }
  //서버에 변경 작업 요청시 사용 캐시된 데이터를 무효화하고 success의 경우 데이터를 다시 불러옴
  const { mutate } = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MyActivities"] });
    },
  });

  //삭제하기 버튼의 동작
  const handleDeleteClick = (activityId: number) => {
    try {
      if (!dialogRef.current) return;
      dialogRef.current.close();
      mutate(activityId);
      alert("체험을 삭제했습니다.");
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };
  //피그마에는 없는데 확인작업으로 정말로 삭제하시겠습니까 모달 만들어 동작하게함
  const handleOpenDeleteModal = (id: number) => {
    setDeleteActivityId(id);
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
  };
  const handleRegisterClick = () => {
    router.push("등록페이지 정해지면 수정");
  };
  //옵저버의 위치 다음페이지 유무 데이터 불러오는 상태에 따라 무한 스크롤이 구현됨
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <div className={cn("reservations-container")}>
        <div className={cn("title")}>
          <Title text="내 체험 관리" />
          <button
            className={cn("register-button")}
            onClick={handleRegisterClick}
          >
            체험 등록하기
          </button>
        </div>

        <div className={cn("card-lists")}>
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.activities.map((activity: GetActivitiesList) => (
                <MyActivitiesCard
                  key={activity.id}
                  activityInfo={activity}
                  handleDelete={handleOpenDeleteModal}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
        <div ref={ref} style={{ height: "1px" }}></div>
        {isFetching && hasNextPage && (
          <div className={cn("loading-container")}>
            <Image
              src="/icons/Icon_loading.svg"
              width={40}
              height={40}
              alt="loadingIcon"
              className={cn("loading-image")}
            />
          </div>
        )}
      </div>
      <DeleteQuestion
        dialogRef={dialogRef}
        activityId={deleteActivityId}
        handleDeleteClick={handleDeleteClick}
      />
    </>
  );
}
