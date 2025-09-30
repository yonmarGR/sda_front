import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import InputError from "@/ui_components/InputError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog, updateBlog } from "@/services/apiBlog";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SmallSpinner from "@/ui_components/SmallSpinner";
import SmallSpinnerText from "@/ui_components/SmallSpinnerText";
import LoginPage from "./LoginPage";

const CreatePostPage = ({ blog, isAuthenticated }) => {
  const { register, handleSubmit, formState, setValue } = useForm({
    defaultValues: blog ? blog : {},
  });
  const { errors } = formState;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const blogID = blog?.id;

  const updateMutation = useMutation({
    mutationFn: ({ data, id }) => updateBlog(data, id),
    onSuccess: () => {
      navigate("/app");
      toast.success("¡Actualizado!");
      console.log("Your post has been updated successfully!");
    },

    onError: (err) => {
      toast.error(err.message);
      console.log("Error updating blog", err);
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => createBlog(data),
    onSuccess: () => {
      toast.success("Publicación exitosa");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/app");
    },
  });

  function onSubmit(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);

    if (data.featured_image && data.featured_image[0]) {
      if (data.featured_image[0] != "/") {
        formData.append("featured_image", data.featured_image[0]);
      }
    }
    if (blog && blogID) {
      updateMutation.mutate({ data: formData, id: blogID });
    } else {
      mutation.mutate(formData);
    }
  }

  if (isAuthenticated === false) {
    return <LoginPage />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${
        blog && "h-[90%] overflow-auto"
      }  md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-6 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl max-sm:text-xl">
          {blog ? "Actualizar Archivo" : "Crear Registro"}
        </h3>

        <p className="max-sm:text-[14px]">
          {blog
            ? "¿Quiere actualizar el registro?"
            : "Crear un nuevo registro."}
        </p>
      </div>

      <div>
        <Label htmlFor="title" className="dark:text-[97989F]">
          Título
        </Label>
        <Input
          type="text"
          id="title"
          {...register("title", {
            required: "Campo requerido",
            minLength: {
              value: 3,
              message: "El título debe tener almenos 3 caracteres",
            },
          })}
          placeholder="Escribe un título"
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[400px] max-sm:w-[300px] max-sm:text-[14px]"
        />

        {errors?.title?.message && <InputError error={errors.title.message} />}
      </div>

      <div>
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          placeholder="Descripcion del registro"
          {...register("content", {
            required: "Campo requerido",
            minLength: {
              value: 10,
              message: "El campo debe tener al menos 10 caracteres",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[400px] text-justify max-sm:w-[300px] max-sm:text-[14px]"
        />
        {errors?.content?.message && (
          <InputError error={errors.content.message} />
        )}
      </div>

      <div className="w-full">
        <Label htmlFor="category">Categoria</Label>

        <Select
          {...register("category", { required: "El campo es requerido" })}
          onValueChange={(value) => setValue("category", value)}
          defaultValue={blog ? blog.category : ""}
        >
          <SelectTrigger className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]">
            <SelectValue placeholder="Selecione una categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categorias</SelectLabel>
              <SelectItem value="Technology">Tecnologia</SelectItem>
              <SelectItem value="Economy">Economia</SelectItem>
              <SelectItem value="Business">Negocios</SelectItem>
              <SelectItem value="Sport">Deporte</SelectItem>
              <SelectItem value="Lifestyle">Estilo de vida</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors?.category?.message && (
          <InputError error={errors.category.message} />
        )}
      </div>

      <div className="w-full">
        <Label htmlFor="featured_image">Imagen de Archivo</Label>
        <Input
          type="file"
          id="picture"
          {...register("featured_image", {
            required: blog ? false : "Campo requerido",
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]"
        />

        {errors?.featured_image?.message && (
          <InputError error={errors.featured_image.message} />
        )}
      </div>

      <div className="w-full flex items-center justify-center flex-col my-4">
        {blog ? (
          <button
            disabled={updateMutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
          >
            {updateMutation.isPending ? (
              <>
                {" "}
                <SmallSpinner /> <SmallSpinnerText text="Actualizando archivo..." />{" "}
              </>
            ) : (
              <SmallSpinnerText text="Actualizar archivo" />
            )}
          </button>
        ) : (
          <button
            disabled={mutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                {" "}
                <SmallSpinner /> <SmallSpinnerText text="Creando registro..." />{" "}
              </>
            ) : (
              <SmallSpinnerText text="Crear registro" />
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CreatePostPage;