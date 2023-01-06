import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../Link';

import GameModal from '../GameModal';

import './styles.css';

type Props = {
  onClose: () => void;
}

const PromoGreetingModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.promo.greeting.go');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
      <span style={{ fontSize: 19 }}>{t('modals.promo.greeting.title')}
        <Link href="https://band.link/abchiphop">abc хип-хоп</Link>
        <span>{t('modals.promo.greeting.titleEnd')} </span>
      </span>
    </GameModal>
  )
}

export default PromoGreetingModal;
