import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { AbledReservationListData } from '../floatingBox/FloatingBox';
import CountMemberInput from '../floatingBox/CountMemberInput';
import ReservationInfo from './ModalContents/ReservationInfo/ReservationInfo';
import Review from './ModalContents/Review/Review';
import Notifications from './ModalContents/Notifications/Notifications';
import DateForm from './ModalContents/dateForm/DateForm';
import { ICON } from '@/constants';
import styles from './Modal.module.scss';
import classNames from 'classnames/bind';

const { x } = ICON;

const cn = classNames.bind(styles);

const MODAL_TYPE = {
  review: 'review',
  reservationInfo: 'reservationInfo',
  dateForm: 'dateForm',
  notifications: 'notifications',
  countMemberInput: 'countMemberInput',
};

interface ModalProps {
  modalType: keyof typeof MODAL_TYPE;
  setShowModal: Dispatch<SetStateAction<string>>;
  control?: Control<any>;
  id?: number;
  abledReservationListData?: AbledReservationListData[];
  setValue?: UseFormSetValue<any>;
  onDownDisabled?: boolean;
}

export default function Modal({ modalType, setShowModal, ...props }: ModalProps) {
  const handelClickCloseModal = () => {
    setShowModal('');
  };
  const ModalContents = {
    [MODAL_TYPE.review]: {
      component: Review,
      prop: { id: props.id as number, onClickCloseModal: handelClickCloseModal },
    },
    [MODAL_TYPE.reservationInfo]: { component: ReservationInfo, prop: {} },
    [MODAL_TYPE.dateForm]: {
      component: DateForm,
      prop: {
        onClickCloseModal: handelClickCloseModal,
        control: props.control,
        abledReservationListData: props.abledReservationListData,
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
      <section className={cn('modal-content', { notifications: modalType === 'notifications' })}>
        <Image src={x.default.src} alt={x.default.alt} width={40} height={40} onClick={handelClickCloseModal} />
        <ContestComponent onClickCloseModal={handelClickCloseModal} {...prop} />
      </section>
      <div
        className={cn('modal-background', { 'no-background': modalType !== 'review' })}
        onClick={handelClickCloseModal}
      ></div>
    </>,
    document.body
  );
}
