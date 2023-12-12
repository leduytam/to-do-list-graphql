import React from 'react';
import { IToDoList } from '../../types/toDoList.interface';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Text } from '@chakra-ui/react';

type Props = {
  toDoList: IToDoList;
};

const ToDoListItem: React.FC<Props> = ({ toDoList }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isActive = id === toDoList.id;

  const handleClick = () => {
    navigate(`/${toDoList.id}`);
  };

  return (
    <Button
      onClick={handleClick}
      variant={isActive ? 'solid' : 'ghost'}
      w="full"
      justifyContent="flex-start"
      textAlign="left"
    >
      <Text fontSize={14} fontWeight={isActive ? '600' : '400'} noOfLines={1}>
        {toDoList.name}
      </Text>
    </Button>
  );
};

export default ToDoListItem;
