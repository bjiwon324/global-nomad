import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { Control, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import CountMemberInput from '../floatingBox/CountMemberInput';
import ReservationInfo from './ModalContents/reservationInfo/ReservationInfo';
import Review from './ModalContents/review/Review';
import Notifications from './ModalContents/notifications/Notifications';
import DateForm from './ModalContents/dateForm/DateForm';
import { AbledReservationListData } from '@/types/dateform';
import { ICON, MODAL_TYPE } from '@/constants';
import styles from './Modal.module.scss';
import classNames from 'classnames/bind';
import { PostReservationData } from '../floatingBox/FloatingBox';
import { GetActivityDetail, Reservation } from '@/types';

const { x } = ICON;

const cn = classNames.bind(styles);

interface ModalProps {
  modalType: keyof typeof MODAL_TYPE;
  setShowModal: Dispatch<SetStateAction<string>>;
  control?: Control<PostReservationData, any>;
  id?: number;
  abledShedule?: GetActivityDetail['schedules'];
  setValue?: UseFormSetValue<PostReservationData>;
  handleSelectSchedule?: (id: number) => void;
  onDownDisabled?: boolean;
  date?: string;
  activityId?: number;
  getdate?: string;
  register?: UseFormRegister<PostReservationData>;
  reservationInfo?: Reservation;
  className?: string;
}

const modalRoot = (modalType: keyof typeof MODAL_TYPE) => {
  switch (modalType) {
    case 'review':
      return document.body;
      break;
    case 'notifications':
      return document.getElementById('modal-root-notice')!;
      break;
    default:
      return document.getElementById('modal-root') || document.body;
      break;
  }
};

export default function Modal({ modalType, className, setShowModal, ...props }: ModalProps) {
  const handleClickCloseModal = () => {
    setShowModal('');
  };
  const ModalContents = {
    [MODAL_TYPE.review]: {
      component: Review,
      prop: { reservationInfo: props.reservationInfo, onClickCloseModal: handleClickCloseModal },
    },
    [MODAL_TYPE.reservationInfo]: {
      component: ReservationInfo,
      prop: { date: props.date, activityId: props.activityId },
    },
    [MODAL_TYPE.dateForm]: {
      component: DateForm,
      prop: {
        onClickCloseModal: handleClickCloseModal,
        control: props.control,
        abledShedule: props.abledShedule,
        handleSelectSchedule: props.handleSelectSchedule,
      },
    },
    [MODAL_TYPE.notifications]: { component: Notifications, prop: {} },
    [MODAL_TYPE.countMemberInput]: {
      component: CountMemberInput,
      prop: {
        setValue: props.setValue,
        control: props.control,
        onDownDisabled: props.onDownDisabled,
      },
    },
  };

  const { component: ContestComponent, prop } = ModalContents[modalType];

  return createPortal(
    <>
      <section
        className={cn(
          'modal-content',
          `${MODAL_TYPE[modalType]}`,
          { notifications: modalType === 'notifications' },
          className
        )}
      >
        <Image src={x.default.src} alt={x.default.alt} width={40} height={40} onClick={handleClickCloseModal} />
        <ContestComponent onClickCloseModal={handleClickCloseModal} {...prop} />
      </section>
      <div
        className={cn('modal-background', { 'no-background': modalType !== 'review' })}
        onClick={handleClickCloseModal}
      ></div>
    </>,
    modalRoot(modalType)
  );
}
