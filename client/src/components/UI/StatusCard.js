import Card from "@material-tailwind/react/Card";
import CardRow from "@material-tailwind/react/CardRow";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardStatus from "@material-tailwind/react/CardStatus";
import CardStatusFooter from "@material-tailwind/react/CardStatusFooter";
import Icon from "@material-tailwind/react/Icon";

const StatusCard = props => {
  const {
    color,
    icon,
    title,
    amount,
    percentage,
    percentageColor,
    percentageIcon,
    date,
  } = props;
  return (
    <div className="px-4 mb-10">
      <Card>
        <CardRow>
          <CardHeader color={color} iconOnly className="mb-0">
            <Icon name={icon} size="3xl" color="white" />
          </CardHeader>

          <CardStatus title={title} amount={amount} />
        </CardRow>

        <CardStatusFooter
          amount={percentage}
          color={percentageColor}
          date={date}
        >
          <Icon color={percentageColor} name={percentageIcon} />
        </CardStatusFooter>
      </Card>
    </div>
  );
};

export default StatusCard;
