import React, { useEffect, useState } from "react";
import styles from "./add-game-form.module.scss";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { getPlatforms } from "src/utils/api";

export default function AddGameForm({ isOpen, closeModal, submitGame }) {
  const [platforms, setPlatforms] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  function onSubmit(game) {
    // format platforms data, submit new game and close modal
    game.platforms = game.platforms?.map((platform) => ({ platform: platform }));
    game.isUserAdded = true;

    // create slug from name, replacing white space
    game.slug = game.name.replace(/\s/g, "-");
    submitGame(game);
    closeModal();
  }

  useEffect(() => {
    getPlatforms().then((response) => {
      setPlatforms(response.data.results);
    });
  }, [isOpen]);

  return (
    <div className={styles.addGameForm}>
      {/* handleSubmit runs validation before calling onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* platforms */}
        {platforms && (
          <>
            <label>Platforms</label>

            <Controller
              render={({ field: { onChange } }) => (
                <Select
                  className={styles.select}
                  isMulti
                  options={platforms.map((platform) => ({
                    value: platform.name,
                    label: platform.name,
                    name: platform.name,
                  }))}
                  onChange={onChange}
                />
              )}
              control={control}
              name="platforms"
              register={register}
              setValue={setValue}
              rules={{ required: true }}
            />

            {errors?.platforms && <label className="error">Required</label>}
          </>
        )}

        {/* name */}
        <label>Name</label>
        {/* register your input into the hook by invoking the "register" function */}
        <input {...register("name", { required: true })} />
        {errors.name && <label className="error">Required</label>}

        {/* image url */}
        <label>Image url</label>
        {/* image */}
        <input
          defaultValue="https://www.theedgesusu.co.uk/wp-content/uploads/2017/09/Super-Mario-Sunshine.jpg"
          {...register("background_image", { required: true })}
        />
        {errors.background_image && <label className="error">Required</label>}

        {/* submit button */}
        <input className={styles.btn} type="submit" />
      </form>
    </div>
  );
}
