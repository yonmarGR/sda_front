import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { registerUser, updateProfile } from "@/services/apiBlog";
import InputError from "@/ui_components/InputError";
import SmallSpinner from "@/ui_components/SmallSpinner";
import SmallSpinnerText from "@/ui_components/SmallSpinnerText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const SignupPage = ({ userInfo, updateForm, toggleModal }) => {

  console.log(userInfo)

  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const { register, handleSubmit, formState, reset, watch } = useForm({defaultValues: userInfo ? userInfo : {}});
  const { errors } = formState;

  const password = watch("password");

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      toast.success("Perfil actualizado exitosamente")
      toggleModal()
      queryClient.invalidateQueries({queryKey: ["users", userInfo?.username]})
    },

    onError: (err) => {
      toast.error(err.message)
    }
  })

  const mutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: () => {
      toast.success("¡Has creado una cuenta exitosamente!");
      reset();
      navigate("/")
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data) {
    if(updateForm){
      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("first_name", data.first_name)
      formData.append("last_name", data.last_name)
      formData.append("job_title", data.job_title)
      formData.append("bio", data.bio)

      if(data.profile_picture && data.profile_picture[0]){
        if(data.profile_picture[0] != "/"){
          formData.append("profile_picture", data.profile_picture[0])
        }
      }

      updateProfileMutation.mutate(formData)

    }

    else {
      const userData = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        // Add confirm_password if your backend expects it
        confirm_password: data.confirmPassword
      };
    
      mutation.mutate(userData);
      
    }
    
  }

  return (
    <form
      className={`${
        updateForm && "h-[90%] overflow-auto"
      } md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit 
    rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">
          {updateForm ? "Actualización de perfil" : "Registro"}
        </h3>
        <p>
          {updateForm
            ? "Descripción del documento."
            : "¡Crea tu cuenta para comenzar!"}
        </p>
      </div>

      <div>
        <Label htmlFor="username" className="dark:text-[97989F]">
          Usuario
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="Ingrese usuario"
          {...register("username", {
            required: "Usuario requerido",
            minLength: {
              value: 3,
              message: "Debe tener almenos 3 caracteres",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.username?.message && (
          <InputError error={errors.username.message} />
        )}
      </div>

      <div>
        <Label htmlFor="first_name">Primer nombre</Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Primer nombre"
          {...register("first_name", {
            required: "Campo requerido",
            minLength: {
              value: 3,
              message: "Debe tener almenos 3 caracteres",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.first_name?.message && (
          <InputError error={errors.first_name.message} />
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Primer apellido</Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Apellido"
          {...register("last_name", {
            required: "Campo requerido",
            minLength: {
              value: 3,
              message: "Debe tener almenos 3 caracteres",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.last_name?.message && (
          <InputError error={errors.last_name.message} />
        )}
      </div>

        


      {updateForm && <div>
        <Label htmlFor="content">Bio</Label>
        <Textarea
          id="content"
          placeholder="Descripción del area"
          {...register("bio", {
            minLength: {
              value: 10,
              message: "Debe contener almenos 10 caracteres",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[300px] text-justify"
        />
        {errors?.bio?.message && (
          <InputError error={errors.bio.message} />
        )}
      </div>}

      {updateForm && <div className="w-full">
        <Label htmlFor="profile_picture">Foto de perfil</Label>
        <Input
          type="file"
          id="picture"
          {...register("profile_picture", {
            required: false,
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]"
        />

        {/* {errors?.profile_picture?.message && (
          <InputError error={errors.profile_picture.message} />
        )} */}
      </div>}


      {updateForm || <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          type="password"
          id="password"
          placeholder="Contraseña"
          {...register("password", {
            required: "Campo requerido",
            minLength: {
              value: 8,
              message: "Debe contener almenos 8 caracteres",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.password?.message && (
          <InputError error={errors.password.message} />
        )}
      </div>}

     {updateForm ||  <div>
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirmar contraseña"
          {...register("confirmPassword", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Debe contener almenos 8 caracteres",
            },
            validate: (value) => value === password || "Contraseñas no coinciden",
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.confirmPassword?.message && (
          <InputError error={errors.confirmPassword.message} />
        )}
      </div>}

      <div className="w-full flex items-center justify-center flex-col my-4">
        {updateForm ? (
          <button
            type="submit"
            disabled={updateProfileMutation.isPending} 
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <SmallSpinner />
                <SmallSpinnerText text="Actualizando usuario..." />
              </>
            ) : (
              <SmallSpinnerText text="Actualizar perfil de usuario" />
            )}
          </button>
        ) : (
          <button 
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <SmallSpinner />
                <SmallSpinnerText text="Creando usuario..." />
              </>
            ) : (
              <SmallSpinnerText text="Registrarse" />
            )}
          </button>
        )}
       {updateForm || <p className="text-[14px]">
          Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
        </p>}
      </div>
    </form>
  );
};

export default SignupPage;