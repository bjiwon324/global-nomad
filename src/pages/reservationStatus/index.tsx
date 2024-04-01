import Layout from '@/components/common/layout/Layout';
import Calendar from '@/components/domain/reservationStatus/Calendar';
import SideNavMenu from '@/components/common/sideNavMenu/SideNavMenu';
import classNames from 'classnames/bind';
import styles from '@/components/domain/reservationStatus/Calendar.module.scss';

const cn = classNames.bind(styles);

export default function ReservationStatus() {
  return (
    <>
      <Layout>
        <div className={cn('wrap')}>
          <SideNavMenu />
          <Calendar />
        </div>
      </Layout>
    </>
  );
}
