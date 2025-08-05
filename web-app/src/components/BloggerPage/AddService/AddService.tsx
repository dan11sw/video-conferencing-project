import { useState, FC, memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IServiceModel } from "src/models/blogger/IServiceModel";

export interface IAddServiceProps {
  service: IServiceModel;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: (
    time_limit: number | null,
    count_limit: number | null,
    price: number
  ) => void;
}

const AddService: FC<IAddServiceProps> = ({
  service,
  open,
  setOpen,
  action,
}) => {
  const [form, setForm] = useState<{
    count_limit: string | null;
    time_limit: string | null;
    price: number;
  }>({
    count_limit: null,
    time_limit: null,
    price: 0,
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    let timeLimit: number | null = null;
    if (form.time_limit && form.time_limit?.length > 0) {
      timeLimit = Number(form.time_limit);
    }

    let countLimit: number | null = null;
    if (form.count_limit && form.count_limit?.length > 0) {
      countLimit = Number(form.count_limit);
    }

    action(timeLimit, countLimit, form.price);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Добавление услуги \"${service.title}\"`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            После заполнения всех полей и нажатия кнопки добавления услуга будет
            предоставляться данным аккаунтом
          </DialogContentText>
          <div>
            <div className="input-field">
              <span>Ограничение по времени (в секундах):</span>
              <input
                id="time_limit"
                type="number"
                name="time_limit"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
            <br />
            <div className="input-field">
              <span>Ограничение по количеству:</span>
              <input
                id="count_limit"
                type="number"
                name="count_limit"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
            <br />
            <div className="input-field">
              <span>Цена (в токенах):</span>
              <input
                id="price"
                type="number"
                name="price"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Нет</Button>
          <Button onClick={handleAgree} autoFocus>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(AddService);
