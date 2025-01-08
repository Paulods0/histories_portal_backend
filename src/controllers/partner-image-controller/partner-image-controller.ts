import { Request, Response, NextFunction } from "express"
import PartnerImageModel from "../../models/partner-image-model"

export class PartnerImageController {
  static async create(
    req: Request<{}, {}, { image: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { image } = req.body
      const partnersImageLength = await PartnerImageModel.countDocuments()
      if (partnersImageLength >= 6) {
        return res
          .status(500)
          .json({ message: "O limite de imagens foi atingido." })
      }
      const partnerImage = new PartnerImageModel({ image })

      await partnerImage.save()

      return res.status(201).json({ message: "Criado com sucesso." })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const partnerImages = await PartnerImageModel.find({})
      return res.status(200).json(partnerImages)
    } catch (error) {
      next(error)
    }
  }
  static async update(
    req: Request<{ id: string }, {}, { image: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const { image } = req.body

      const updated = await PartnerImageModel.findByIdAndUpdate(
        id,
        { image },
        { new: true }
      )
      if (!updated) {
        return res.status(404).json({ message: "Não encontrado." })
      }

      return res.status(200).json({ message: "Atualizado com sucesso." })
    } catch (error) {
      next(error)
    }
  }
  static async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const existingPartnerImage = await PartnerImageModel.findById(id)
      if (!existingPartnerImage) {
        return res.status(404).json({ message: "Não encontrado." })
      }

      await PartnerImageModel.deleteOne()
      return res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}
