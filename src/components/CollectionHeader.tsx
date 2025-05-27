import React from 'react';

interface CollectionHeaderProps {
  title: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ title }) => {
  return (
    <div className="border-l-4 border-purple-500 pl-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
};

export default CollectionHeader;