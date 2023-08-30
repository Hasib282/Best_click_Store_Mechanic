import { Body, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, Res, Session, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import session from "express-session";
import { diskStorage, MulterError } from "multer";
import { ChatDTO } from "../customer/Customer DTO/chat.DTO";
import { MechanicService } from "./mechanic.service";
import { MechanicDTO, MechanicForgetPasswordDTO, MechanicLoginDTO, MechanicUpdateDTO, MechanicUpdatePassDTO } from "./MechanicDTO/mechanic.DTO";
import { ServiceDTO } from "./MechanicDTO/service.DTO";
import { SessionGuard } from "./session.guard";


@Controller('mechanic')
export class MechanicController {
    constructor(
        private readonly mechanicService: MechanicService,

    ) { }


    /////////////////////////////////////// Registration part start here ////////////////////////////////////////////////////

    
    @Post('registration')
    @UseInterceptors(FileInterceptor('profile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg|JPG|WEBP|PNG|JPEG)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 1000000 },
            storage: diskStorage({
                destination: './profile',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
    async mechanicRegistration(@Body() data: MechanicDTO, @UploadedFile() profileobj: Express.Multer.File) {
        const email = await this.mechanicService.checkEmail(data.mechanic_email);
        const nid = await this.mechanicService.checkNid(data.mechanic_nid);
        const phone = await this.mechanicService.checkPhone(data.mechanic_phone);
        if (email != null) {
            throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
        }
        if (nid != null) {
            throw new HttpException('NID already exist', HttpStatus.BAD_REQUEST);
        }
        if (phone != null) {
            throw new HttpException('Phone already exist', HttpStatus.BAD_REQUEST);
        }
        if (!profileobj) {
            throw new HttpException('Please select your profile picture', HttpStatus.BAD_REQUEST);
        }
        else {
            data.mechanic_profilepic = profileobj.filename;
            this.mechanicService.mechanicRegistration(data);
        }
        
    }

    

    //////////////////////////////////////// registration part end here //////////////////////////////////////////////


    //////////////////////////////////////// login part start here ///////////////////////////////////////////////////

    

    @Post('login')
    @UsePipes(new ValidationPipe)
    async mechanicLogin(@Session() session, @Body() data: MechanicLoginDTO) {
        try {
            const login = await this.mechanicService.mechanicLogin(data);
            if (login != true) {
                throw new HttpException('User doesnt exist. ', HttpStatus.NOT_FOUND);
            }
            else {
                session.email = data.email;
                console.log("Welcome " + session.email);
                return login;
            }
        }
        catch (error) {
            throw new HttpException('Email or Password is incorrect. ', HttpStatus.NOT_FOUND);
        }
        
    }

    


    ////////////////////////////////////// login part end here ///////////////////////////////////////////////////////

    ////////////////////////////////////////// Forget password part start ////////////////////////////////////////////


    //show profile
    @Post('forgetpass')
    async forgetPassword(@Body() data: { email: string }) {
        const verify = await this.mechanicService.getProfile(data.email);
        if (verify == null) {
            return false;
        }
        else {
            await this.mechanicService.forgetPassword(data.email);
            return true;
        }
    }


    //forget password
    @Put('updatepassword/:email')
    @UsePipes(new ValidationPipe)
    async updatePassword(@Param('email') email, @Body() data: MechanicForgetPasswordDTO) {
        const verify = await this.mechanicService.verifyPin(data);
        const mechanic = await this.mechanicService.getProfile(email);
        if (verify == true) {
            return this.mechanicService.changePassword(mechanic.mechanic_id, data.confirm_password);
        }
        else {
            return false;
        }
    }

    ////////////////////////////////////////// Forget password part end ////////////////////////////////////////////


    ///////////////////////////////////// profile part start here ///////////////////////////////////////////////////

    //Show all mechanice
    @Get('mechanics')
    async getAllMechanics() {
        return this.mechanicService.getAllMechanics();
    }

    @Get('mechanic/:id')
    async getMechanicById(@Param('id', ParseIntPipe)id) {
        return this.mechanicService.getMechanicById(id);
    }
    

    //show profile
    @Get('profile')
    @UseGuards(SessionGuard)
    async getProfile(@Session() session) {
        return this.mechanicService.getProfile(session.email);
    }



    

    /*@Get('profile')
    async getProfilebyQuerry(@Query('email')email) {
        return this.mechanicService.getProfile(email);
    }*/


    //Show Profile picture
    /*@Get('profilepic')
    @UseGuards(SessionGuard)
    async getImages(@Session() session, @Res() res): Promise<any> {
        const profile = await this.mechanicService.getProfile(session.email);
        res.sendFile(profile.profile.mechanic_profilepic, { root: './profile' })
    }*/



    //show profilepic by name
    @Get('profilepic/:name')
    async getImages(@Param('name') name, @Res() res): Promise<any> {
        res.sendFile(name, { root: './profile' })
    }



    //change profilepic
    @Put('changeprofile')
    @UseInterceptors(FileInterceptor('profile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 300000 },
            storage: diskStorage({
                destination: './profile',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UseGuards(SessionGuard)
    async updateProfilePicture(@Session() session, @UploadedFile() changeprofile: Express.Multer.File): Promise<string> {
        return await this.mechanicService.updateProfilePicture(session.email, changeprofile);
    }


    /*@Put('changeprofile')
    @UseInterceptors(FileInterceptor('profile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 300000 },
            storage: diskStorage({
                destination: './profile',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    async updateProfilePicture(@Query('email') email,@UploadedFile() changeprofile: Express.Multer.File): Promise<string> {
        return await this.mechanicService.updateProfilePicture(email, changeprofile);
         
    }*/


    //Update profile data
    @Put('updateprofile')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe())
    async updateProfile(@Session() session, @Body() data: MechanicUpdateDTO) {
        const checknid = await this.mechanicService.checkEmail(data.mechanic_nid);
        const checkphone = await this.mechanicService.checkPhone(data.mechanic_phone);
        const profile = await this.mechanicService.getProfile(session.email);
        if (checknid != null && data.mechanic_nid != profile.mechanic_nid) {
            throw new HttpException('NID already exist', HttpStatus.CONFLICT);
        }
        if (checkphone != null && data.mechanic_phone != profile.mechanic_phone) {
            throw new HttpException('Phone already exist', HttpStatus.CONFLICT);
        }
        else {
            return this.mechanicService.updateProfile(profile.mechanic_id, data);
        }
    }




    /*//Update profile data
    @Put('updateprofile')
    @UsePipes(new ValidationPipe())
    async updateProfile(@Query('email') email, @Body() data: MechanicUpdateDTO) {
        const checknid = await this.mechanicService.checkNid(data.mechanic_nid);
        const checkphone = await this.mechanicService.checkPhone(data.mechanic_phone);
        const profile = await this.mechanicService.getProfile(email);
        if (checknid != null && data.mechanic_nid != profile.mechanic_nid) {
            throw new HttpException('NID already exist', HttpStatus.BAD_REQUEST);
        }
        if (checkphone != null && data.mechanic_phone != profile.mechanic_phone) {
            throw new HttpException('Phone already exist', HttpStatus.BAD_REQUEST);
        }
        else {
            return this.mechanicService.updateProfile(profile.mechanic_id, data);
        }
    }*/


    //Change password
    @Patch('changepass')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe)
    async updatePass(@Session() session, @Body() data: MechanicUpdatePassDTO): Promise<any> {
        const profile = await this.mechanicService.getProfile(session.email);
        const oldpass = await this.mechanicService.verifyPassword(profile.mechanic_id, data);
        if (oldpass == true) {
            if (data.new_password != data.confirm_password) {
                throw new HttpException('New Password and confirm Password doesnt match', HttpStatus.NOT_ACCEPTABLE);
            }
            if (data.old_password == data.new_password) {
                throw new HttpException('New Password and old Password cant be same', HttpStatus.NOT_ACCEPTABLE);
            }
            else {
                return this.mechanicService.changePassword(profile.profile.mechanic_id, data.confirm_password);
            }
        }
        else {
            throw new HttpException('Old Password doesnt match', HttpStatus.NOT_ACCEPTABLE);
        }

    }




    /*//Change password
    @Put('changepass')
    @UsePipes(new ValidationPipe)
    async updatePass(@Query('email') email, @Body() data: MechanicUpdatePassDTO): Promise<any> {
        const profile = await this.mechanicService.getProfile(email);
        const oldpass = await this.mechanicService.verifyPassword(profile.mechanic_id, data);
        if (oldpass == true) {
            if (data.new_password != data.confirm_password) {
                throw new HttpException('New Password and confirm Password doesnt match', HttpStatus.NOT_ACCEPTABLE);
            }
            if (data.old_password == data.new_password) {
                throw new HttpException('New Password and old Password cant be same', HttpStatus.BAD_REQUEST);
            }
            else {
                return this.mechanicService.changePassword(profile.profile.mechanic_id, data.confirm_password);
            }
        }
        else {
            throw new HttpException('Old Password doesnt match', HttpStatus.NOT_ACCEPTABLE);
        }
    }*/



    //delete mechanic profile
    @Delete("deleteprofile")
    @UseGuards(SessionGuard)
    async deleteMechanic(@Session() session) {
        const profile = await this.mechanicService.getProfile(session.email);
        return this.mechanicService.deleteProfile(profile.mechanic_id);
    }



    //Logout
    @Post('logout')
    signout(@Req() req) {
        if (req.session.destroy()) {
            return true;
        }
        else {
            throw new HttpException("invalid actions", HttpStatus.UNAUTHORIZED);
        }
    }

    

    /////////////////////////////////////////// profile part end here ///////////////////////////////////////////////////


    ////////////////////////////////////////// Service Part start here /////////////////////////////////////////

    //Create new sercive
    @Post('addservice')
    @UsePipes(new ValidationPipe)
    async createService(@Body() data: ServiceDTO) {
        return this.mechanicService.createService(data);
    }


    //Get all services
    @Get('services')
    async getServices() {
        return this.mechanicService.getAllServices();
    }


    @Get('allservices')
    async getAllServices() {
        return this.mechanicService.getAllService();
    }


    //Get Services By Id
    @Get('service')
    async getServiceById(@Query('id', ParseIntPipe) id: number) {
        const service = await this.mechanicService.getService(id);
        if (!service) {
            throw new HttpException('Servic not available', HttpStatus.NOT_FOUND);
        }
        return service; 
    }


    //update service
    @Put('updateservice')
    @UsePipes(new ValidationPipe)
    async updateService(@Query('id', ParseIntPipe) id: number, @Body() data: ServiceDTO) {
        const service = await this.mechanicService.getService(id);
        if (!service) {
            throw new HttpException('Servic not available', HttpStatus.NOT_FOUND);
        }
        return this.mechanicService.updateService(id, data);
    }


    //delete service
    @Delete('deleteservice')
    @UsePipes(new ValidationPipe)
    async deleteService(@Query('id', ParseIntPipe) id: number) {
        const service = await this.mechanicService.getService(id);
        if (!service) {
            throw new HttpException('Servic not available', HttpStatus.NOT_FOUND);
        }
        return this.mechanicService.deleteService(id);
    }


    


    //////////////////////////////////////// Service part end here ///////////////////////////////////////////


    //////////////////////////////////////// Mechanic Service part start here ///////////////////////////////////////////

    //add mechanic services
    @Post('mechanicservice')
    @UseGuards(SessionGuard)
    async addServiceToMechanic(@Session() session, @Body() serviceId: { service_id:number[]}) {
        const profile = await this.mechanicService.getProfile(session.email);
        return this.mechanicService.addServiceToMechanic(profile.mechanic_id, serviceId.service_id);
    }



    //get mechanic service by mechanic id
    @Get('mechanicservice')
    @UseGuards(SessionGuard)
    async getServiceByMechanicID(@Session() session) {
        const profile = await this.mechanicService.getProfile(session.email);
        return this.mechanicService.getServiceByMechanicID(profile.mechanic_id);
    }




    //get mechanic service by service id
    @Get('mechanicservices')
    @UseGuards(SessionGuard)
    async getMechanicServices() {
        return this.mechanicService.getMechanicServices();
    }



    //delete mechanic services
    @Delete('deletemechanicservice')
    @UseGuards(SessionGuard)
    async deleteMechanicService(@Session() session, @Body() service: { service_id: number }) {
        const profile = await this.mechanicService.getProfile(session.email);
        return this.mechanicService.deleteMechanicServices(profile.mechanic_id, service.service_id);
    }


    

    //////////////////////////////////////// Mechanic Service part end here /////////////////////////////////////////////


    //////////////////////////////////// Mechanic Response to service request part start //////////////////////////////
    
    @Get('showrequest/:id')
    @UseGuards(SessionGuard)
    async getCustomerRequestService(@Param('id', ParseIntPipe) id) {
        return this.mechanicService.getCustomerRequestService(id);
    }

    /////////////////////////////////// Mechanic Response to service request part end /////////////////////////////////////



    //////////////////////////////////////// Mechanic Chat Part start here //////////////////////////////////////////////

    //Mechanic Send Message
    @Post('sendmessage')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe)
    async mechanicSendMessage(@Session() session, @Query('customerid', ParseIntPipe) customerid, @Body() message: ChatDTO) {
        const mechanic = await this.mechanicService.getProfile(session.email);
        const customer = await this.mechanicService.getCustomerById(customerid);
        if (!customer) {
            throw new HttpException('Customer not available', HttpStatus.NOT_FOUND);
        }
        return this.mechanicService.mechanicSendMessage(mechanic.mechanic_id, customerid, message);

    }


    //Show messages by mechanic id
    @Get('showmessages')
    @UseGuards(SessionGuard)
    async showMechanicChat(@Session() session) {
        const mechanic = await this.mechanicService.getProfile(session.email);
        return await this.mechanicService.showMechanicChat(mechanic.mechanic_id);
    }



    @Get('showallmessages')
    async showChat() {
        return await this.mechanicService.showChats();
    }


    @Get('showamechanicmessages')
    async showMechanicChats(id) {
        return await this.mechanicService.showMechanicChats(id);
    }

    /////////////////////////////////////// Mechanic Chat Part end here /////////////////////////////////////////////////


    ////////////////////////////////////// Customer part start here /////////////////////////////////////////////////////

    @Get('customer/:id')
    async getCustomerById(@Param('id', ParseIntPipe)id) {
        return await this.mechanicService.getCustomerById(id);
    }

    //show profilepic by name
    @Get('customerprofilepic/:name')
    async getImage(@Param('name') name, @Res() res): Promise<any> {
        res.sendFile(name, { root: './customerprofile' })
    }

    ///////////////////////////////////// customer part end here .///////////////////////////////////////////////////////
}