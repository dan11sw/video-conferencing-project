import { useState, FC, memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ICurrentServiceModel } from "src/models/blogger/IServiceModel";

export interface IEditServiceProps {
  service: ICurrentServiceModel;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: (
    time_limit: number | null,
    count_limit: number | null,
    price: number
  ) => void;
}

const EditService: FC<IEditServiceProps> = ({
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
    count_limit: String(service.count_limit),
    time_limit: String(service.time_limit),
    price: service.price,
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
        <DialogTitle id="alert-dialog-title">{`Изменение услуги \"${service.service.title}\"`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            После заполнения всех полей и нажатия кнопки изменения все данные
            о предоставлении услуги будут изменены
          </DialogContentText>
          <div>
            <div className="input-field">
              <span>Ограничение по времени (в секундах):</span>
              <input
                id="time_limit"
                type="number"
                name="time_limit"
                className="yellow-input"
                defaultValue={(service.time_limit)? String(service.time_limit) : ""}
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
                defaultValue={(service.count_limit)? String(service.count_limit) : ""}
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
                defaultValue={service.price}
                onChange={onChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Нет</Button>
          <Button onClick={handleAgree} autoFocus>
            Изменить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(EditService);
