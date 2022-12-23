import React from 'react';
import { useTranslation } from 'react-i18next';

import GameModal from '../GameModal';

type Props = {
  onClose: () => void;
}

const PromoGreetingModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const buttonLabel = t('modals.continueButton');

  return (
    <GameModal buttonLabel={buttonLabel} onClose={onClose}>
      <span style={{ fontSize: 19 }}>{t('modals.promo.greeting.title')}
        <a style={{ fontSize: 20 }} href="https://band.link/abchiphop" target="_blank">abc хип-хоп</a>
        <span>{t('modals.promo.greeting.titleEnd')} </span>
      </span>
    </GameModal>
  )
}

export default PromoGreetingModal;
