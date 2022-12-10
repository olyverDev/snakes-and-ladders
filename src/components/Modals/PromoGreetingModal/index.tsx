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
      <span>{t('modals.promo.greeting.title')} </span>
    </GameModal>
  )
}

export default PromoGreetingModal;
