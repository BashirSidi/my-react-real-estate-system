import React from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  TableBody,
  TableCell,
  Typography,
  TableHead,
  TableContainer,
  TableRow,
  Link,
  Box,
} from '@material-ui/core';
import DayJS from 'dayjs';
import ClevertapReact from 'clevertap-react';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { BOX_TO_BOX } from 'config';
import IEventName from 'shared/event-name.enum';
import { useCurrentCountry } from 'utilities/market';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import useStyles from './styles';
import { HostReservationsQuery_bookings_edges } from '../../queries/__generated__/HostReservationsQuery';
import { Roles } from '../../contants/role';
import usePageTranslation from '../../../../hooks/usePageTranslation';

interface IProps {
  role: Roles;
  data: HostReservationsQuery_bookings_edges[];
}

const ReservationTable: React.FunctionComponent<IProps> = ({
  role,
  data,
}): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const currentCountry = useCurrentCountry().name;
  const { t } = usePageTranslation('hostReservation', 'Table');
  const { t: commonT } = usePageTranslation('common', 'SiteBookingStatus');
  if (data.length === 0) {
    return (
      <Box className={classes.box}>
        <Typography className={classes.noReservation}>
          {t('noReservation')}
        </Typography>
        {role === Roles.HOST && (
          <Typography className={classes.noReservationMsg}>
            {t('noReservationMsg')}
          </Typography>
        )}
      </Box>
    );
  }

  const goToDetails = (item: HostReservationsQuery_bookings_edges) => {
    try {
      const eventName = IEventName.BOOKING_DETAIL_VIEWED;
      const trackingPayload = {
        siteName: item?.site_name || '',
        platform: 'WEB',
        moveInDate: item?.move_in_date || '',
        moveOutDate: item?.move_out_date || '',
        spaceFeatures: [...new Set(item?.space_features)].toString() || '',
        customerPhone: item?.customer_phone_number || '',
        spaceSize: item?.space_size || 0,
        customerName: item?.customer.first_name || '',
        language: router?.locale,
        customerEmail: item?.customer?.email || '',
        country: currentCountry,
        bookingAmount: item?.total_amount || '',
        bookingId: item?.id || '',
        userId: item?.customer?.id || '',
      };
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.BOOKING_DETAIL_VIEWED, errEvent);
    }

    if (role === Roles.GUEST) {
      router.push(`/${router.locale}/customer/bookings/${item?.id}`);
    } else {
      router.push(`${router.locale}/host/reservations/${item?.id}`);
    }
  };

  const hostHeaders: string[] = [
    t('header1'),
    t('header2'),
    t('header3'),
    t('header4'),
    t('header5'),
    t('header6'),
    t('header7'),
  ];

  const guestHeaders: string[] = [
    t('header1'),
    t('header2'),
    t('header4'),
    t('header5'),
    t('header6'),
    t('header7'),
  ];

  return (
    <>
      <TableContainer>
        <Table className={`${classes.table} ${classes.root}`} aria-label="simple table">
          <TableHead className={classes.tableHead}>
            <TableRow>
              {role === Roles.HOST && hostHeaders.map((item: string, index: number) => (
                <TableCell key={`${item}_${index}`}>{item}</TableCell>
              ))}
              {role === Roles.GUEST && guestHeaders.map((item: string, index: number) => (
                <TableCell key={`${item}_${index}`}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map((item: HostReservationsQuery_bookings_edges, index: number) => (
                <TableRow key={`${item?.id}_${index}`}>
                  <TableCell className={classes.rowItems}>

                    <Link className={classes.link} onClick={() => goToDetails(item)}>
                      {item?.short_id}
                    </Link>
                  </TableCell>
                  <TableCell
                    className={`${classes.rowItems} ${classes.status} ${item?.status?.toLocaleLowerCase()}`}
                  >
                    {commonT(item?.status)}
                  </TableCell>
                  {role === Roles.HOST && (
                    <TableCell className={classes.customer}>
                      <Typography variant="caption" display="block">
                        {item?.customer?.first_name}
                        {item?.customer?.last_name}
                      </Typography>
                      <Typography display="block" className={classes.subtitle}>
                        {`${item?.customer?.email ? item?.customer?.email : ''}
                    ${item?.customer?.phone_number}
                    `}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell className={classes.property}>
                    <Typography variant="caption" display="block">
                      {item?.site_name}
                    </Typography>
                    {item?.site_name !== BOX_TO_BOX && (
                      <Typography display="block" className={classes.subtitle}>
                        {`${item?.site_address?.street}
                    ${item?.site_address?.flat}
                    ${item?.site_address?.postal_code}
                    ${item?.site_address?.country.name_en}
                    `}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {item?.site_name !== BOX_TO_BOX && (
                    <Typography variant="caption" display="block" className={`${classes.rowItems} ${classes.sizeitem}`}>
                      {item?.space_size}
                      {' '}
                      {item?.space_size_unit}
                    </Typography>
                    )}
                    {item?.site_name === BOX_TO_BOX && (
                    <Typography variant="caption" display="block" className={`${classes.rowItems} ${classes.sizeitem}`}>
                        {item?.original_space?.name}
                    </Typography>
                    )}
                    <Typography display="block" className={`${classes.subtitle} ${classes.sizeitemColor}`} />
                  </TableCell>
                  <TableCell className={classes.rowItems}>
                    {item?.move_in_date ? DayJS(item?.move_in_date).format('D MMM, YYYY') : ''}
                  </TableCell>
                  <TableCell className={classes.rowItems}>
                    {item?.move_out_date ? DayJS(item?.move_out_date).format('D MMM, YYYY') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReservationTable;
